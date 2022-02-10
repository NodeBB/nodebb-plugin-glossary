'use strict';

const validator = require('validator');
const nconf = require.main.require('nconf');

const db = require.main.require('./src/database');
const pagination = require.main.require('./src/pagination');

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
		keywords.forEach((keyword) => {
			if (keyword && keyword.name) {
				keyword.name = validator.escape(String(keyword.name));
				keyword.description = validator.escape(String(keyword.description));
				keyword.info = validator.escape(String(keyword.info));
				keyword.url = `${relative_path}/search?in=posts&term=${keyword.name}`;
			}
		});
	}
	const pageCount = Math.max(1, Math.ceil(count / keywordsPerPage));
	res.render('glossary', {
		keywords: keywords,
		pagination: pagination.create(page, pageCount, req.query),
	});
};

Controllers.renderAdminPage = function (req, res/* , next */) {
	res.render('admin/plugins/glossary', {});
};


