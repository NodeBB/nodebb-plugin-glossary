'use strict';

/* globals csv */

define('admin/plugins/glossary', [
	'settings', 'settings/sorted-list', 'bootbox', 'benchpress', 'alerts',
], function (settings, sortedList, bootbox, benchpress, alerts) {
	var ACP = {};

	ACP.init = function () {
		settings.load('glossary', $('.glossary-settings'));
		$('#save').on('click', saveSettings);

		$('#upload-csv').on('click', function () {
			const modal = bootbox.dialog({
				title: 'Upload CSV',
				message: '<textarea id="csv-input" class="form-control"></textarea>',
				buttons: {
					submit: {
						label: 'Add',
						className: 'btn-primary',
						callback: async function () {
							const text = modal.find('#csv-input').val();
							const lines = await csv({
								noheader: true,
								output: 'json',
							}).fromString(text);

							// eslint-disable-next-line no-restricted-syntax
							for (const line of lines) {
								// eslint-disable-next-line no-await-in-loop
								const form = $(await benchpress.render('admin/plugins/glossary/partials/sorted-list/form', {}));
								form.find('#name').val(line.field1);
								form.find('#description').val(line.field2);
								form.find('#info').val(line.field3 || '');
								sortedList.addItem(form.children(), $('[data-sorted-list="keywords"]'));
							}
						},
					},
				},
			});
			return false;
		});

		$('#empty-glossary').on('click', function () {
			bootbox.confirm('Are you sure you want to delete all keywords?', function (ok) {
				if (!ok) {
					return;
				}

				socket.emit('admin.plugins.glossary.empty', {}, function (err) {
					if (err) {
						return alerts.error(err);
					}
					ajaxify.refresh();
				});
			});
			return false;
		});
	};

	function saveSettings() {
		settings.save('glossary', $('.glossary-settings'), function () {
			alerts.alert({
				type: 'success',
				alert_id: 'glossary-saved',
				title: 'Settings Saved',
				message: 'Please reload your NodeBB to apply these settings',
				clickfn: function () {
					socket.emit('admin.reload');
				},
			});
		});
	}

	return ACP;
});
