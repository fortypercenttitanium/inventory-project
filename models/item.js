const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new Schema({
	name: { type: String, required: true },
	description: {
		type: String,
		required: true,
	},
	brand: {
		type: Schema.Types.ObjectId,
		ref: 'Brand',
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	stock: {
		type: Number,
		required: true,
		min: 0,
	},
	category: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Category',
		},
	],
});

ItemSchema.virtual('url').get(function () {
	return `/catalog/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
