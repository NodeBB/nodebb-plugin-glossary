'use strict';

define('admin/plugins/glossary', ['settings'], function (settings) {
	var ACP = {};

	ACP.init = function () {
		settings.load('glossary', $('.glossary-settings'));
		$('#save').on('click', saveSettings);
	};

	function saveSettings() {
		settings.save('glossary', $('.glossary-settings'), function () {
			app.alert({
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
