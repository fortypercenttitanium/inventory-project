const async = require('async');
const Item = require('../models/item');
const Category = require('../models/category');
const Brand = require('../models/brand');
const { validationResult, body } = require('express-validator');

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
			if (err) {
				return next(err);
			}
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
	async.parallel(
		{
			brands: function (callback) {
				Brand.find(callback);
			},
			categories: function (callback) {
				Category.find({}, 'name').exec(callback);
			},
		},
		function (err, results) {
			if (err) {
				return next(err);
			}
			const { brands, categories } = results;
			console.log(categories);
			res.render('item_create', {
				title: 'Create New Item',
				brands,
				categories,
			});
		}
	);
};

const item_create_post = [
	(req, res, next) => {
		if (!(req.body.category instanceof Array)) {
			req.body.category =
				typeof req.body.category === 'undefined'
					? []
					: new Array(req.body.category);
		}
		next();
	},
	body('name', 'Name is required')
		.trim()
		.isLength({ min: 1, max: 20 })
		.escape(),
	body('description', 'Please provide description')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('brand', 'Brand must be selected').trim().isLength({ min: 1 }).escape(),
	body('category.*', 'Category must be selected').escape(),
	body('price')
		.trim()
		.isLength({ min: 1 })
		.isCurrency({ allow_negatives: false })
		.escape()
		.withMessage('Invalid price value'),
	body('stock', 'Invalid stock value')
		.trim()
		.isLength({ min: 1 })
		.isInt({ min: 0 })
		.escape(),
	(req, res, next) => {
		const errors = validationResult(req);
		const { name, description, brand, category, price, stock } = req.body;
		if (!category.length) {
			errors.errors.push({
				msg: 'At least one category must be selected',
				value: '',
				param: 'category',
				location: 'body',
			});
		}
		const item = new Item({ name, description, brand, price, stock, category });
		if (!errors.isEmpty()) {
			async.parallel(
				{
					categories: function (callback) {
						Category.find({}, 'name').exec(callback);
					},
					brands: function (callback) {
						Brand.find(callback);
					},
				},
				(err, results) => {
					if (err) {
						return next(err);
					}
					const { categories, brands } = results;
					res.render('item_create', {
						title: 'Create New Item',
						item,
						categories,
						brands,
						errors: errors.array(),
					});
				}
			);
			return;
		} else {
			item.save((err, newItem) => {
				if (err) {
					return next(err);
				}
				res.redirect(newItem.url);
			});
		}
	},
];
const item_delete_get = (req, res, next) => {
	Item.findById(req.params.id)
		.populate('brand')
		.exec((err, item) => {
			if (err) {
				return next(err);
			}
			if (item == null) {
				res.send('Item not found');
			} else {
				res.render('item_delete', { item });
			}
		});
};
const item_delete_post = (req, res, next) => {
	Item.findById(req.body.item_id).exec((err, item) => {
		if (err) {
			return next(err);
		}
		Item.findByIdAndRemove(item._id, (err) => {
			if (err) {
				return next(err);
			} else {
				res.redirect('/catalog/items');
			}
		});
	});
};
const item_update_get = (req, res, next) => {
	async.parallel(
		{
			item: function (callback) {
				Item.findById(req.params.id).exec(callback);
			},
			brands: function (callback) {
				Brand.find(callback);
			},
			categories: function (callback) {
				Category.find(callback);
			},
		},
		(err, results) => {
			if (err) {
				return next(err);
			}
			const { item, brands, categories } = results;
			if (item == null) {
				const error = new Error('Item not found');
				error.status = 404;
				return next(error);
			} else {
				res.render('item_create', {
					title: 'Update Item',
					item,
					brands,
					categories,
				});
			}
		}
	);
};
const item_update_post = [
	(req, res, next) => {
		if (!(req.body.category instanceof Array)) {
			req.body.category =
				typeof req.body.category === 'undefined'
					? []
					: new Array(req.body.category);
		}
		next();
	},
	body('name', 'Name is required')
		.trim()
		.isLength({ min: 1, max: 20 })
		.escape(),
	body('description', 'Please provide description')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('brand', 'Brand must be selected').trim().isLength({ min: 1 }).escape(),
	body('category.*', 'Category must be selected').escape(),
	body('price')
		.trim()
		.isLength({ min: 1 })
		.isCurrency({ allow_negatives: false })
		.escape()
		.withMessage('Invalid price value'),
	body('stock', 'Invalid stock value')
		.trim()
		.isLength({ min: 1 })
		.isInt({ min: 0 })
		.escape(),
	(req, res, next) => {
		const errors = validationResult(req);
		const { name, description, brand, category, price, stock } = req.body;
		if (!category.length) {
			errors.errors.push({
				msg: 'At least one category must be selected',
				value: '',
				param: 'category',
				location: 'body',
			});
		}
		const item = new Item({
			name,
			description,
			brand,
			price,
			stock,
			category,
			_id: req.params.id,
		});
		if (!errors.isEmpty()) {
			async.parallel(
				{
					categories: function (callback) {
						Category.find({}, 'name').exec(callback);
					},
					brands: function (callback) {
						Brand.find(callback);
					},
				},
				(err, results) => {
					if (err) {
						return next(err);
					}
					const { categories, brands } = results;
					res.render('item_create', {
						title: 'Update Item',
						item,
						categories,
						brands,
						errors: errors.array(),
					});
				}
			);
			return;
		} else {
			Item.findByIdAndUpdate(req.params.id, item, {}, (err, newItem) => {
				if (err) {
					return next(err);
				}
				res.redirect(newItem.url);
			});
		}
	},
];
const item_detail = (req, res, next) => {
	Item.findById(req.params.id)
		.populate('category')
		.populate('brand')
		.exec((err, item) => {
			if (err) {
				return next(err);
			}
			if (item == null) {
				const err = new Error('Item not found');
				err.status = 404;
				throw err;
			} else {
				res.render('item_detail', { title: 'Item details', item });
			}
		});
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
			if (err) {
				return next(err);
			}
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
