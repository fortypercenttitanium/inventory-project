const async = require('async');
const { body, validationResult } = require('express-validator');
const Item = require('../models/item');
const Category = require('../models/category');
const Brand = require('../models/brand');

const category_create_get = (req, res, next) => {
	res.render('category_create', {
		title: 'Create New Category',
	});
};
const category_create_post = [
	body('name', 'Category name is required')
		.trim()
		.isLength({ min: 1, max: 20 })
		.escape(),
	body('description', 'Description is required')
		.trim()
		.isLength({ min: 1 })
		.escape(),

	(req, res, next) => {
		// check for errors
		const errors = validationResult(req);
		const { name, description } = req.body;
		const category = new Category({ name, description });
		if (!errors.isEmpty()) {
			res.render('category_create', {
				title: 'Create New Category',
				category,
				errors: errors.array(),
			});
			return;
		} else {
			// check if category exists
			Category.findOne({
				name: name,
			}).exec((err, result) => {
				if (err) {
					return next(err);
				}
				if (result) {
					res.redirect(result.url);
				} else {
					category.save(function (err) {
						if (err) {
							return next(err);
						}
						res.redirect(category.url);
					});
				}
			});
		}
	},
];
const category_delete_get = (req, res, next) => {
	async.parallel(
		{
			category: function (callback) {
				Category.findById(req.params.id).exec(callback);
			},
			items: function (callback) {
				Item.find({ category: req.params.id }).populate('brand').exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			const { category, items } = results;
			res.render('category_delete', {
				title: 'Delete Category',
				category,
				items,
			});
		}
	);
};
const category_delete_post = (req, res, next) => {
	async.parallel(
		{
			category: function (callback) {
				Category.findById(req.body.category_id).exec(callback);
			},
			items: function (callback) {
				Item.find({ brand: req.body.category_id }).exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			const { category, items } = results;
			if (items.length) {
				res.render('category_delete', {
					title: 'Delete Category',
					category,
					items,
				});
			} else {
				Category.findByIdAndRemove(category._id, (err) => {
					if (err) {
						return next(err);
					} else {
						res.redirect('/catalog/categories');
					}
				});
			}
		}
	);
};
const category_update_get = (req, res, next) => {
	Category.findById(req.params.id).exec((err, category) => {
		if (err) {
			return next(err);
		}
		if (category == null) {
			const error = new Error('Category not found');
			error.status = 404;
			return next(error);
		} else {
			res.render('category_create', { title: 'Update Category', category });
		}
	});
};
const category_update_post = [
	body('name', 'Category name is required')
		.trim()
		.isLength({ min: 1, max: 20 })
		.escape(),
	body('description', 'Description is required')
		.trim()
		.isLength({ min: 1 })
		.escape(),

	(req, res, next) => {
		// check for errors
		const errors = validationResult(req);
		const { name, description } = req.body;
		const category = new Category({ name, description, _id: req.params.id });
		if (!errors.isEmpty()) {
			res.render('category_create', {
				title: 'Update Category',
				category,
				errors: errors.array(),
			});
			return;
		} else {
			// check if category exists
			Category.findOne({
				name: name,
			}).exec((err, result) => {
				if (err) {
					return next(err);
				}
				if (result) {
					res.redirect(result.url);
				} else {
					Category.findByIdAndUpdate(req.params.id, category, {}, function (
						err,
						cat
					) {
						if (err) {
							return next(err);
						}
						res.redirect(cat.url);
					});
				}
			});
		}
	},
];
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
			if (err) {
				return next(err);
			}
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
		if (err) {
			return next(err);
		}
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
