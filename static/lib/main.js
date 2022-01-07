'use strict';

$(document).ready(function () {
	$('#content').on('mouseenter', '.glossary-wrapper', function (ev) {
		const $this = $(this);
		if ($this.attr('data-original-title')) {
			return;
		}
		$this.tooltip({
			container: '#content',
		});
		$this.trigger(ev);
	});
});
