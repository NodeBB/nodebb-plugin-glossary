'use strict';

const controllers = require('./lib/controllers');

const db = require.main.require('./src/database');
const cache = require.main.require('./src/cache');
const utils = require.main.require('./src/utils');
const routeHelpers = require.main.require('./src/routes/helpers');
const meta = require.main.require('./src/meta');
const pubsub = require.main.require('./src/pubsub');
const socketAdminPlugins = require.main.require('./src/socket.io/admin/plugins');

const plugin = module.exports;

let settings;

plugin.init = async (params) => {
	const { router, middleware } = params;
	await loadSettings();
	pubsub.on(`action:settings.set.glossary`, async () => {
		await loadSettings();
	});

	socketAdminPlugins.glossary = {};
	socketAdminPlugins.glossary.empty = async function () {
		const ids = await db.getSortedSetRange(`settings:glossary:sorted-list:keywords`, 0, -1);
		await db.deleteAll(ids.map(id => `settings:glossary:sorted-list:keywords:${id}`));
		await db.delete(`settings:glossary:sorted-list:keywords`);
		cache.del(`settings:glossary`);
		await loadSettings();
	};

	routeHelpers.setupPageRoute(router, '/glossary', middleware, [], controllers.renderGlossary);
	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/glossary', middleware, [], controllers.renderAdminPage);
};

async function loadSettings() {
	settings = await meta.settings.get('glossary');
	if (!settings.hasOwnProperty('icon')) {
		settings.icon = 'fa-info';
		await meta.settings.setOne('glossary', 'icon', 'fa-info');
	}
	plugin.generateRegexes(settings);
}

plugin.generateRegexes = function (settings) {
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
				const escaped = utils.escapeRegexChars(keyword.name);
				keyword.nameRegex = new RegExp(`\\b(${escaped})\\b(?=[^>]*<)`, options);
			}
		});
	}
};

plugin.filterParsePost = async (hookData) => {
	if (hookData.postData && hookData.postData.content && settings.enabled !== 'off') {
		plugin.parsePost(hookData.postData, settings);
	}
	return hookData;
};

plugin.parsePost = function (postData, settings) {
	if (Array.isArray(settings.keywords)) {
		let iconHtml = '';
		if (settings.icon) {
			iconHtml = `<i class="fa ${settings.icon} fa-sm"></i>`;
		}
		settings.keywords.forEach((keyword) => {
			postData.content = postData.content.replace(
				keyword.nameRegex,
				(match, p1) => `<span class="glossary-wrapper" title="${keyword.description}" data-toggle="tooltip" data-placement="top"><span class="glossary-word">${p1}</span> ${iconHtml}</span>`,
			);
		});
	}
};

plugin.addAdminNavigation = (header) => {
	header.plugins.push({
		route: '/plugins/glossary',
		icon: 'fa-info',
		name: 'Glossary',
	});

	return header;
};

