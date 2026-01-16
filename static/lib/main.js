'use strict';

$(document).ready(function () {
	function initTooltips() {
		const tooltipTriggerList = document.querySelectorAll('#content .glossary-wrapper');
		tooltipTriggerList.forEach(function (el) {
			if (typeof bootstrap !== 'undefined') {
				if (!bootstrap.Tooltip.getInstance(el)) {
					new bootstrap.Tooltip(el);
				}
			}
		});
	}

	initTooltips();

	$(window).on('action:posts.loaded action:ajaxify.end', function () {
		initTooltips();
	});
});
