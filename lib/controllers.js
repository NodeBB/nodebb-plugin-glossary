'use strict';

const nconf = nodebb.require('nconf');

const db = nodebb.require('./src/database');
const pagination = nodebb.require('./src/pagination');
const plugins = nodebb.require('./src/plugins');

const Controllers = module.exports;

Controllers.renderGlossary = async function (req, res) {
	const page = Math.max(1, parseInt(req.query.page, 10) || 1);
	const keywordsPerPage = 50;
	const start = ((page - 1) * keywordsPerPage);
	const stop = start + keywordsPerPage - 1;
	const relative_path = nconf.get('relative_path');
	const [ids, count] = await Promise.all([
		db.getSortedSetRange(`settings:glossary:sorted-list:keywords`, start, stop),
		db.sortedSetCard(`settings:glossary:sorted-list:keywords`),
	]);

	const keywords = await db.getObjects(ids.map(id => `settings:glossary:sorted-list:keywords:${id}`));

	if (Array.isArray(keywords)) {
		await Promise.all(keywords.map(async (keyword) => {
			if (keyword && keyword.name) {
				keyword.url = `${relative_path}/search?in=posts&term=${keyword.name}`;
				keyword.info = await plugins.hooks.fire('filter:parse.raw', String(keyword.info || ''));
			}
		}));
	}
	const pageCount = Math.max(1, Math.ceil(count / keywordsPerPage));
	res.render('glossary', {
		keywords: keywords,
		pagination: pagination.create(page, pageCount, req.query),
	});
};

Controllers.renderAdminPage = function (req, res/* , next */) {
	res.render('admin/plugins/glossary', {
		title: 'Glossary',
	});
};


