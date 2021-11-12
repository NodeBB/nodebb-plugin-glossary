'use strict';

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
		let options = '';
		if (settings.singleMatch !== 'on') {
			options += 'g';
		}
		if (settings.caseSensitive !== 'on') {
			options += 'i';
		}
		settings.keywords.forEach((keyword) => {
			if (keyword && keyword.name) {
				keyword.nameRegex = new RegExp(`\\b(${keyword.name})\\b`, options);
			}
		});
	}
}

plugin.filterParsePost = async (hookData) => {
	if (hookData.postData && hookData.postData.content && settings.enabled !== 'off') {
		if (Array.isArray(settings.keywords)) {
			settings.keywords.forEach((keyword, i) => {
				hookData.postData.content = hookData.postData.content.replace(
					keyword.nameRegex,
					`<span class="glossary-wrapper" title="glossary-${i}" data-toggle="tooltip" data-placement="top"><span class="glossary-word">$1</span> <i class="fa fa-info fa-sm"></i></span>`
				);
			});

			settings.keywords.forEach((keyword, i) => {
				hookData.postData.content = hookData.postData.content.replace(
					new RegExp(`glossary-${i}`, 'g'),
					keyword.description
				);
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

