module.exports = {
	if_eq: function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	},
	if_not_eq: function (a, b, options) {
		return !(a === b) ? options.fn(this) : options.inverse(this);
	},
	match_cat: function (item, category, options) {
		return item.category.some(
			(cat) => cat._id.toString() === category._id.toString()
		)
			? options.fn(this)
			: options.inverse(this);
	},
};
