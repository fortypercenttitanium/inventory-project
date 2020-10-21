const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
	name: { type: String, required: true, maxlength: 20 },
	description: String,
});

CategorySchema.virtual('url').get(function () {
	return `/catalog/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);
