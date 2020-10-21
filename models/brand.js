const mongoose = require('mongoose');
const { Schema } = mongoose;

const BrandSchema = new Schema({
	name: { type: String, required: true, maxlength: 20 },
});

BrandSchema.virtual('url').get(function () {
	return `/catalog/${this._id}`;
});

module.exports = mongoose.model('Brand', BrandSchema);
