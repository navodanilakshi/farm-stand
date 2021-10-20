const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/product');
const Farm = require('../models/farm');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { productSchema } = require('../schemas');
const validateProduct = (req, res, next) => {
	const { name, price, category } = req.body;
	const { error } = productSchema.validate({ name, price, category });
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new AppError(msg, 400);
	} else {
		next();
	}
};

const categories = [ 'fruit', 'vegetable', 'dairy' ];

router.get(
	'/',
	catchAsync(async (req, res) => {
		const products = await Product.find({});
		res.render('products/index', { products });
	})
);
router.get('/new', (req, res) => {
	res.render('products/new');
});

router.get(
	'/:id',
	catchAsync(async (req, res, next) => {
		const { id } = req.params;
		const product = await Product.findById(id).populate([ { path: 'farm', model: Farm } ]);

		if (!product) {
			throw new AppError('Product not found', 404);
		}
		res.render('products/show', { product });
	})
);

router.get(
	'/:id/edit',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) {
			throw new AppError('Product not found', 404);
		}
		res.render('products/edit', { product, categories });
	})
);
router.patch(
	'/:id',
	validateProduct,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const { name, price, category } = req.body;
		await Product.findByIdAndUpdate(id, { name, price, category });
		res.redirect(`/products/${id}`);
	})
);
router.delete(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Product.findByIdAndDelete(id);
		res.redirect('/products');
	})
);

module.exports = router;
