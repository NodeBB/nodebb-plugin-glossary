'use strict';

/* globals csv */

define('admin/plugins/glossary', [
	'settings', 'settings/sorted-list', 'bootbox', 'benchpress', 'alerts', 'translator',
], function (settings, sortedList, bootbox, benchpress, alerts, translator) {
	var ACP = {};

	ACP.init = function () {
		settings.load('glossary', $('.glossary-settings'));
		$('#save').on('click', saveSettings);

		$('#upload-csv').on('click', async function () {
			const title = await translator.translate('[[glossary:admin.uploadCsv]]');
			const addLabel = await translator.translate('[[glossary:admin.add]]');
			const modal = bootbox.dialog({
				title: title,
				message: '<textarea id="csv-input" class="form-control"></textarea>',
				buttons: {
					submit: {
						label: addLabel,
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

		$('#empty-glossary').on('click', async function () {
			const confirmMsg = await translator.translate('[[glossary:admin.confirmDeleteAll]]');
			bootbox.confirm(confirmMsg, function (ok) {
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

	async function saveSettings() {
		const savedTitle = await translator.translate('[[glossary:admin.settingsSaved]]');
		const savedMessage = await translator.translate('[[glossary:admin.reloadMessage]]');
		settings.save('glossary', $('.glossary-settings'), function () {
			alerts.alert({
				type: 'success',
				alert_id: 'glossary-saved',
				title: savedTitle,
				message: savedMessage,
				clickfn: function () {
					socket.emit('admin.reload');
				},
			});
		});
	}

	return ACP;
});
