#! /usr/bin/env node

console.log(
	'This script populates some stuff to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Item = require('./models/item');
var Category = require('./models/category');
var Brand = require('./models/brand');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];
var categories = [];
var brands = [];

function categoryCreate({ name, description }, cb) {
	var category = new Category({ name, description });

	category.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log('New Category: ' + category);
		categories.push(category);
		cb(null, category);
	});
}

function brandCreate({ name }, cb) {
	var brand = new Brand({ name });

	brand.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log('New Brand: ' + brand);
		brands.push(brand);
		cb(null, brand);
	});
}

function itemCreate(name, description, brand, price, stock, category, cb) {
	itemdetail = {
		name,
		description,
		brand,
		price,
		stock,
	};
	if (category != false) itemdetail.category = category;

	var item = new Item(itemdetail);
	item.save(function (err) {
		if (err) {
			cb(err, null);
			return;
		}
		console.log('New Item: ' + item);
		items.push(item);
		cb(null, item);
	});
}

function createBrandsAndCategories(cb) {
	async.series(
		[
			function (callback) {
				categoryCreate(
					{ name: 'Components', description: 'Limbs, body parts, etc...' },
					callback
				);
			},
			function (callback) {
				categoryCreate(
					{
						name: 'Internal modules',
						description: 'CPUs, memory, hard drives, etc...',
					},
					callback
				);
			},
			function (callback) {
				categoryCreate({ name: 'Hardware' }, callback);
			},
			function (callback) {
				categoryCreate(
					{
						name: 'Accessories',
						description: 'Eyes, sensors, antennae, etc...',
					},
					callback
				);
			},
			function (callback) {
				brandCreate({ name: 'MFRC' }, callback);
			},
			function (callback) {
				brandCreate({ name: 'Leading Competitor' }, callback);
			},
			function (callback) {
				brandCreate({ name: 'Trailing Competitor' }, callback);
			},
			function (callback) {
				brandCreate({ name: 'Generic' }, callback);
			},
		],
		cb
	);
}

function createItems(cb) {
	async.parallel(
		[
			function (callback) {
				itemCreate(
					'Robot arm',
					'Programmable robot arm.',
					brands[0],
					129.99,
					14,
					[categories[0]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Robot leg',
					'Programmable robot leg.',
					brands[0],
					119.99,
					8,
					[categories[0]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Robot arm',
					'Programmable robot arm.',
					brands[1],
					119.99,
					4,
					[categories[0]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Robot leg',
					'Programmable robot leg.',
					brands[1],
					109.99,
					6,
					[categories[0]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Robot head',
					'Robot head, feature 4 expansion bays and three cooling fans.',
					brands[2],
					79.99,
					5,
					[categories[0]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Robot torso',
					'Robot torso chassis, measures 3ft x 2ft, cooling system included.',
					brands[0],
					189.99,
					4,
					[categories[0]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Robot eye',
					'Robot eye. Basic optical features, no lasers or x-ray vision.',
					brands[3],
					19.99,
					28,
					[categories[3]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Robot finger',
					'Universal robot finger, follows programming of arm module.',
					brands[1],
					14.99,
					120,
					[categories[2]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Robot CPU',
					'Central processing unit, fully programmable for all of your robot needs.',
					brands[0],
					245.99,
					20,
					[categories[1]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Robot CPU',
					'Central processing unit, fully programmable for all of your robot needs.',
					brands[1],
					235.99,
					20,
					[categories[1]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Robot CPU',
					'Central processing unit, fully programmable for all of your robot needs.',
					brands[2],
					225.99,
					20,
					[categories[1]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Robot Memory Chip',
					"So your robot doesn't just go around forgetting things all the time.",
					brands[0],
					49.99,
					24,
					[categories[1]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Robot Memory Chip',
					"So your robot doesn't just go around forgetting things all the time.",
					brands[1],
					39.99,
					24,
					[categories[1]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Gyrometer',
					'Without it, your robot will not be able to gyrate properly.',
					brands[0],
					19.99,
					22,
					[categories[1]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Hard drive',
					'For long-term storage.',
					brands[0],
					59.99,
					17,
					[categories[1]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Nut',
					'A nut, like one you would put on a bolt.',
					brands[0],
					0.99,
					337,
					[categories[2]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Bolt',
					'A bolt, line one you would put through a nut.',
					brands[0],
					0.99,
					214,
					[categories[2]],
					callback
				);
			},
			function (callback) {
				itemCreate(
					'Metal Plate',
					'Made of the finest metal we could find at the scrap yard.',
					brands[0],
					3.99,
					111,
					[categories[2]],
					callback
				);
			},
		],
		// optional callback
		cb
	);
}

async.series(
	[createBrandsAndCategories, createItems],
	// Optional callback
	function (err, results) {
		if (err) {
			console.log('FINAL ERR: ' + err);
		} else {
			console.log('Created: ' + results);
		}
		// All done, disconnect from database
		mongoose.connection.close();
	}
);
