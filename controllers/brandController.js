const async = require('async');
const Item = require('../models/item');
const Brand = require('../models/brand');
const { validationResult, body } = require('express-validator');

const brand_create_get = (req, res, next) => {
	res.render('brand_create', { title: 'Create New Brand' });
};
const brand_create_post = [
	body('name', 'Brand name is required').trim().isLength({ min: 1 }).escape(),

	(req, res, next) => {
		// check for errors
		const errors = validationResult(req);
		const brand = new Brand({ name: req.body.name });
		if (!errors.isEmpty()) {
			res.render('brand_create', {
				title: 'Create New Brand',
				brand,
				errors: errors.array(),
			});
			return;
		} else {
			// check if brand exists
			Brand.findOne({
				name: req.body.name,
			}).exec((err, result) => {
				if (err) {
					return next(err);
				}
				if (result) {
					res.redirect(result.url);
				} else {
					brand.save(function (err) {
						if (err) {
							return next(err);
						}
						res.redirect(brand.url);
					});
				}
			});
		}
	},
];
const brand_delete_get = (req, res, next) => {
	async.parallel(
		{
			brand: function (callback) {
				Brand.findById(req.params.id).exec(callback);
			},
			items: function (callback) {
				Item.find({ brand: req.params.id }).exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			const { brand, items } = results;
			res.render('brand_delete', { title: 'Delete Brand', brand, items });
		}
	);
};
const brand_delete_post = (req, res, next) => {
	async.parallel(
		{
			brand: function (callback) {
				Brand.findById(req.body.brand_id).exec(callback);
			},
			items: function (callback) {
				Item.find({ brand: req.body.brand_id }).exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			const { brand, items } = results;
			if (items.length) {
				res.render('brand_delete', { title: 'Delete Brand', brand, items });
			} else {
				Brand.findByIdAndRemove(brand._id, (err) => {
					if (err) {
						return next(err);
					} else {
						res.redirect('/catalog/brands');
					}
				});
			}
		}
	);
};
const brand_update_get = (req, res, next) => {
	Brand.findById(req.params.id).exec((err, brand) => {
		if (err) {
			return next(err);
		}
		if (brand == null) {
			const error = new Error('Brand not found');
			error.status = 404;
			return next(error);
		} else {
			res.render('brand_create', { title: 'Update Brand', brand });
		}
	});
};
const brand_update_post = [
	body('name', 'Brand name is required').trim().isLength({ min: 1 }).escape(),

	(req, res, next) => {
		// check for errors
		const errors = validationResult(req);
		const brand = new Brand({ name: req.body.name, _id: req.params.id });
		if (!errors.isEmpty()) {
			res.render('brand_create', {
				title: 'Update Brand',
				brand,
				errors: errors.array(),
			});
			return;
		} else {
			// check if brand exists
			Brand.findOne({
				name: req.body.name,
			}).exec((err, result) => {
				if (err) {
					return next(err);
				}
				if (result) {
					res.redirect(result.url);
				} else {
					Brand.findByIdAndUpdate(req.params.id, brand, {}, function (err) {
						if (err) {
							return next(err);
						}
						res.redirect(brand.url);
					});
				}
			});
		}
	},
];
const brand_detail = (req, res, next) => {
	async.parallel(
		{
			brand: function (callback) {
				Brand.findById(req.params.id).exec(callback);
			},
			items: function (callback) {
				Item.find({ brand: req.params.id }).exec(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			const { items, brand } = results;
			if (brand == null) {
				const err = new Error('Brand not found');
				err.status = 404;
				throw err;
			} else {
				res.render('brand_detail', { title: brand.name, brand, items });
			}
		}
	);
};
const brand_list = (req, res, next) => {
	Brand.find((err, brands) => {
		if (err) {
			return next(err);
		}
		res.render('brand_list', { title: 'Browse Brands', brands });
	});
};

module.exports = {
	brand_create_get,
	brand_create_post,
	brand_delete_get,
	brand_delete_post,
	brand_update_get,
	brand_update_post,
	brand_detail,
	brand_list,
};
