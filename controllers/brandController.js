const async = require('async');
const Item = require('../models/item');
const Category = require('../models/category');
const Brand = require('../models/brand');

const brand_create_get = (req, res, next) => {
	res.send('Not yet implemented');
};
const brand_create_post = (req, res, next) => {
	res.send('Not yet implemented');
};
const brand_delete_get = (req, res, next) => {
	res.send('Not yet implemented');
};
const brand_delete_post = (req, res, next) => {
	res.send('Not yet implemented');
};
const brand_update_get = (req, res, next) => {
	res.send('Not yet implemented');
};
const brand_update_post = (req, res, next) => {
	res.send('Not yet implemented');
};
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
			if (err) next(err);
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
		if (err) next(err);
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
