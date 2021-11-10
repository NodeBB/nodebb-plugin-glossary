'use strict';

const _ = require('lodash');

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
				keyword.nameRegex = new RegExp(`\\b${keyword.name}\\b`, 'gi');
			}
		});
	}
}

plugin.filterParsePost = async (hookData) => {
	if (hookData.postData && hookData.postData.content && settings.enabled !== 'off') {
		const { keywords } = settings;
		if (Array.isArray(keywords)) {
			keywords.forEach((keyword) => {
				const matches = hookData.postData.content.match(keyword.nameRegex);
				if (matches && matches.length) {
					_.uniq(matches).forEach((match) => {
						hookData.postData.content = hookData.postData.content.replace(
							new RegExp(match, 'g'),
							`<span class="glossary-wrapper" title="${keyword.description}" data-toggle="tooltip" data-placement="top">${match} <i class="fa fa-info fa-sm"></i></span>`
						);
					});
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

