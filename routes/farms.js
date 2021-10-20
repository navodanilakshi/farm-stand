const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/product');
const Farm = require('../models/farm');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { farmSchema } = require('../schemas');
const validateFarm = (req, res, next) => {
	const { name, city, email } = req.body;
	const { error } = farmSchema.validate({ name, city, email });
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
		const farms = await Farm.find({});
		res.render('farms/index', { farms });
	})
);

router.get('/new', (req, res) => {
	res.render('farms/new');
});

router.post(
	'/',
	validateFarm,
	catchAsync(async (req, res) => {
		const farm = new Farm(req.body);
		await farm.save();
		req.flash('success', 'Successfully Created Farm!');
		res.redirect('/farms');
	})
);

router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const farm = await Farm.findById(id).populate([ { path: 'products', model: Product } ]);
		if (!farm) {
			req.flash('error', 'Cannot Find Farm!');
			res.redirect('/farms');
		}
		res.render('farms/show', { farm });
	})
);
router.get(
	'/:id/products/new',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const farm = await Farm.findById(id);
		if (!farm) {
			req.flash('error', 'Cannot Find Farm!');
			res.redirect('/farms');
		}
		res.render('products/new', { farm, categories });
	})
);

router.post(
	'/:id/products',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const farm = await Farm.findById(id);
		const product = new Product(req.body);
		product.farm = farm;
		farm.products.push(product);
		await product.save();
		await farm.save();
		req.flash('success', 'Successfully Created Product!');
		res.redirect(`/farms/${farm.id}`);
	})
);
router.delete(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Farm.findByIdAndDelete(id);
		res.redirect('/farms');
	})
);

module.exports = router;
