const async = require('async');
const Item = require('../models/item');
const Category = require('../models/category');
const Brand = require('../models/brand');

const category_create_get = (req, res, next) => {
	res.send('Not yet implemented');
};
const category_create_post = (req, res, next) => {
	res.send('Not yet implemented');
};
const category_delete_get = (req, res, next) => {
	res.send('Not yet implemented');
};
const category_delete_post = (req, res, next) => {
	res.send('Not yet implemented');
};
const category_update_get = (req, res, next) => {
	res.send('Not yet implemented');
};
const category_update_post = (req, res, next) => {
	res.send('Not yet implemented');
};
const category_detail = (req, res, next) => {
	async.parallel(
		{
			category: function (callback) {
				Category.findById(req.params.id).exec(callback);
			},
			items: function (callback) {
				Item.find({ category: req.params.id })
					.populate('brand')
					.sort('name')
					.exec(callback);
			},
		},
		(err, results) => {
			if (err) next(err);
			const { items, category } = results;
			if (category == null) {
				const err = new Error('Category not found');
				err.status = 404;
				throw err;
			} else {
				res.render('category_detail', {
					title: `Browse ${category.name}`,
					category,
					items,
				});
			}
		}
	);
};
const category_list = (req, res, next) => {
	Category.find((err, categories) => {
		if (err) next(err);
		res.render('category_list', { title: 'Browse Categories', categories });
	});
};

module.exports = {
	category_create_get,
	category_create_post,
	category_delete_get,
	category_delete_post,
	category_update_get,
	category_update_post,
	category_detail,
	category_list,
};
