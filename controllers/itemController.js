const async = require('async');
const Item = require('../models/item');
const Category = require('../models/category');
const Brand = require('../models/brand');

function index(req, res, next) {
	async.parallel(
		{
			itemCount: function (callback) {
				Item.countDocuments({}, callback);
			},
			stock: function (callback) {
				Item.find({}, callback);
			},
			brands: function (callback) {
				Brand.find({}, callback);
			},
			categories: function (callback) {
				Category.find({}, callback);
			},
		},
		(err, results) => {
			if (err) next(err);
			const { itemCount, stock, brands, categories } = results;
			const stockCount = stock.reduce((acc, val) => {
				return acc + val.stock;
			}, 0);
			res.render('index', {
				title: 'Store Inventory',
				itemCount,
				stockCount,
				brands,
				categories,
			});
		}
	);
}

const item_create_get = (req, res, next) => {
	res.send('Not yet implemented');
};
const item_create_post = (req, res, next) => {
	res.send('Not yet implemented');
};
const item_delete_get = (req, res, next) => {
	res.send('Not yet implemented');
};
const item_delete_post = (req, res, next) => {
	res.send('Not yet implemented');
};
const item_update_get = (req, res, next) => {
	res.send('Not yet implemented');
};
const item_update_post = (req, res, next) => {
	res.send('Not yet implemented');
};
const item_detail = (req, res, next) => {
	res.send('Not yet implemented');
};
const item_list = (req, res, next) => {
	async.parallel(
		{
			items: function (callback) {
				Item.find({}, 'name price stock')
					.populate('brand')
					.populate('category')
					.exec(callback);
			},
			categories: function (callback) {
				Category.find(callback);
			},
		},
		function (err, results) {
			if (err) next(err);
			const { items, categories } = results;
			res.render('item_list', {
				title: 'All items',
				items,
				categories,
			});
		}
	);
};

module.exports = {
	index,
	item_create_get,
	item_create_post,
	item_delete_get,
	item_delete_post,
	item_update_get,
	item_update_post,
	item_detail,
	item_list,
};
