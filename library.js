'use strict';

const _ = require('lodash');
const XRegExp = require('xregexp');

const controllers = require('./lib/controllers');

const routeHelpers = require.main.require('./src/routes/helpers');
const meta = require.main.require('./src/meta');
const pubsub = require.main.require('./src/pubsub');

const plugin = module.exports;

let settings;

plugin.init = async (params) => {
	const { router, middleware } = params;
	settings = await meta.settings.get('glossary');
	generateRegexes();
	pubsub.on(`action:settings.set.glossary`, async () => {
		settings = await meta.settings.get('glossary');
		generateRegexes();
	});

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/glossary', middleware, [], controllers.renderAdminPage);
};

function generateRegexes() {
	if (Array.isArray(settings.keywords)) {
		settings.keywords.forEach((keyword) => {
			if (keyword.name) {
				keyword.nameRegex = XRegExp(`(?:^|\\s|\\>|;)(${keyword.name})`, 'gi');
			}
		});
	}
}

plugin.filterParsePost = async (hookData) => {
	if (hookData.postData && hookData.postData.content && settings.enabled !== 'off') {
		const originalContent = hookData.postData.content;
		const foundMatch = {};
		if (Array.isArray(settings.keywords)) {
			settings.keywords.forEach((keyword, i) => {
				const matches = originalContent.match(keyword.nameRegex);
				if (matches && matches.length) {
					_.uniq(matches).forEach((match) => {
						if (match.startsWith(' ') || match.startsWith('>')) {
							const matchValue = match.slice(1);
							foundMatch[i] = true;
							hookData.postData.content = hookData.postData.content.replace(
								new RegExp(match, 'g'),
								`${match[0]}<span class="glossary-wrapper" title="glossary-${i}" data-toggle="tooltip" data-placement="top"><span class="glossary-word">${matchValue}</span> <i class="fa fa-info fa-sm"></i></span>`
							);
						}
					});
				}
			});
			settings.keywords.forEach((keyword, i) => {
				if (foundMatch[i]) {
					hookData.postData.content = hookData.postData.content.replace(
						new RegExp(`glossary-${i}`, 'g'),
						keyword.description
					);
				}
			});
		}
	}
	return hookData;
};

plugin.addAdminNavigation = (header) => {
	header.plugins.push({
		route: '/plugins/glossary',
		icon: 'fa-info',
		name: 'Glossary',
	});

	return header;
};

