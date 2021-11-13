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

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/glossary', middleware, [], controllers.renderAdminPage);
};

async function loadSettings() {
	settings = await meta.settings.get('glossary');
	generateRegexes();
}

function generateRegexes() {
	if (Array.isArray(settings.keywords)) {
		let options = '';
		if (settings.singleMatch !== 'on') {
			options += 'g';
		}
		if (settings.caseSensitive !== 'on') {
			options += 'i';
		}
		settings.keywords.forEach((keyword, i) => {
			if (keyword && keyword.name) {
				const escaped = utils.escapeRegexChars(keyword.name);
				keyword.nameRegex = new RegExp(`(?:^|\\s|\\>|;)\\b(${escaped})\\b`, options);
				keyword.titleRegex = new RegExp(`title="glossary-${i}"`, 'g');
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
					(match, p1) => {
						const space = match.startsWith(' ') ? ' ' : '';
						return `
							<span class="glossary-wrapper" title="glossary-${i}" data-toggle="tooltip" data-placement="top">
								${space}<span class="glossary-word">${p1}</span> <i class="fa fa-info fa-sm"></i>
							</span>
						`;
					},
				);
			});

			settings.keywords.forEach((keyword) => {
				hookData.postData.content = hookData.postData.content.replace(
					keyword.titleRegex,
					() => `title="${keyword.description}"`
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

