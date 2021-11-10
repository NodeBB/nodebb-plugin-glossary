'use strict';

$(document).ready(function () {
	$(window).on('action:posts.loaded action:topic.loaded action:posts.edited', function () {
		$('.glossary-wrapper').tooltip();
	});
});
