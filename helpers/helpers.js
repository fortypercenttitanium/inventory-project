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
	name_exists: function (item, options) {
		return item ? item.name : '';
	},
	description_exists: function (item, options) {
		return item ? item.description : '';
	},
	price_exists: function (item, options) {
		return item ? item.price : '';
	},
	stock_exists: function (item, options) {
		return item ? item.stock : '';
	},
	check_selected_category: function (item, category, options) {
		if (item && category) {
			return item.category.some(
				(cat) => cat.toString() === category._id.toString()
			)
				? 'checked'
				: '';
		} else return '';
	},
	check_selected_brand: function (item, brand, options) {
		if (item && brand) {
			return item.brand.toString() === brand._id.toString() ? 'selected' : '';
		} else return '';
	},
	delete_page: function (url) {
		return `${url}/delete`;
	},
	update_page: function (url) {
		return `${url}/update`;
	},
};
