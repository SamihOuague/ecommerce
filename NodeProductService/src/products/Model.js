const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  	title: {
		type: String,
		required: true,
		unique: true
	},
  	price: {
		type: Number,
		required: true,
	},
	categoryTag: {
		type: String,
		required: true,
	},
	weight: {
		type: String,
		required: true,
	},
	available: {
		type: Boolean,
		default: true,
	},
	describ: String,
  	img: String,
	aroma: String,
});

const SubCategorySchema = new mongoose.Schema({
	name: {
	  	type: String,
	  	required: true,
  	}
});

const Schema = new mongoose.Schema({
  	category: {
		type: String,
		required: true,
	},
  	subcategory: [SubCategorySchema],
});

const ReviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    comment: String,
    rate: {
        type: Number,
        required: true,
    },
    product_id: {
        type: String,
        required: true,
    }
}, { collection: "reviews" });

//Schema.pre('save', function (next) {
//  
//});

module.exports = { 
	CategoriesModel: mongoose.model('Categorie', Schema),
	ProductModel: mongoose.model('Product', ProductSchema),
	ReviewsModel: mongoose.model('Review', ReviewSchema),
};