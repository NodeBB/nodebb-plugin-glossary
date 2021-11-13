'use strict';

/* globals describe, it */

const assert = require('assert');

describe('nodebb-plugin-glossary', () => {
	const settings = {
		singleMatch: 'off',
		caseSensitive: 'off',
		keywords: [
			{
				name: 'REDIS',
				description: 'a fast in memory database',
			},
		],
	};

	it('should match and replace all keywords in content', () => {
		const plugin = require('../library');
		plugin.generateRegexes(settings);
		const postData = {
			content: `<p dir="auto">redis is a very fast database, REDIS uses ram. redis.</p>`,
		};
		plugin.parsePost(postData, settings);

		assert.strictEqual(
			postData.content,
			`<p dir="auto"><span class="glossary-wrapper" title="a fast in memory database" data-toggle="tooltip" data-placement="top"><span class="glossary-word">redis</span> <i class="fa fa-info fa-sm"></i></span> is a very fast database, <span class="glossary-wrapper" title="a fast in memory database" data-toggle="tooltip" data-placement="top"><span class="glossary-word">REDIS</span> <i class="fa fa-info fa-sm"></i></span> uses ram. <span class="glossary-wrapper" title="a fast in memory database" data-toggle="tooltip" data-placement="top"><span class="glossary-word">redis</span> <i class="fa fa-info fa-sm"></i></span>.</p>`
		);
	});

	it('should only match the first keyword if single match is turned on', () => {
		const plugin = require('../library');
		settings.singleMatch = 'on';
		plugin.generateRegexes(settings);
		const postData = {
			content: `<p dir="auto">redis is a very fast database, REDIS uses ram. redis.</p>`,
		};
		plugin.parsePost(postData, settings);
		assert.strictEqual(
			postData.content,
			`<p dir="auto"><span class="glossary-wrapper" title="a fast in memory database" data-toggle="tooltip" data-placement="top"><span class="glossary-word">redis</span> <i class="fa fa-info fa-sm"></i></span> is a very fast database, REDIS uses ram. redis.</p>`
		);
	});

	it('should only match the first keyword that matches the case if single match and case sensitive are turned on', () => {
		const plugin = require('../library');
		settings.singleMatch = 'on';
		settings.caseSensitive = 'on';
		plugin.generateRegexes(settings);
		const postData = {
			content: `<p dir="auto">redis is a very fast database, REDIS uses ram. redis.</p>`,
		};
		plugin.parsePost(postData, settings);
		console.log(postData.content);
		assert.strictEqual(
			postData.content,
			`<p dir="auto">redis is a very fast database, <span class="glossary-wrapper" title="a fast in memory database" data-toggle="tooltip" data-placement="top"><span class="glossary-word">REDIS</span> <i class="fa fa-info fa-sm"></i></span> uses ram. redis.</p>`
		);
	});
});

