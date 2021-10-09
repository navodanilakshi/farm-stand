const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const catchAsync = require('./utils/catchAsync');
const { productSchema } = require('./schemas');
mongoose
	.connect('mongodb://localhost:27017/farmDemo', { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MONGO CONNECTION OPEN!!!');
	})
	.catch((err) => {
		console.log('OH NO MONGO CONNECTION ERROR!!!!');
		console.log(err);
	});

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
const categories = [ 'fruit', 'vegetable', 'dairy' ];

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

app.get(
	'/products',
	catchAsync(async (req, res) => {
		const products = await Product.find({});
		res.render('products/index', { products });
	})
);
app.get('/products/new', (req, res) => {
	res.render('products/new');
});

app.post(
	'/products',
	validateProduct,
	catchAsync(async (req, res) => {
		const { name, price, category } = req.body;
		const product = new Product({ name, price, category });
		await product.save();
		res.redirect('/products');
	})
);

app.get(
	'/products/:id',
	catchAsync(async (req, res, next) => {
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) {
			throw new AppError('Product not found', 404);
		}
		res.render('products/show', { product });
	})
);

app.get(
	'/products/:id/edit',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) {
			throw new AppError('Product not found', 404);
		}
		res.render('products/edit', { product, categories });
	})
);
app.patch(
	'/products/:id',
	validateProduct,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const { name, price, category } = req.body;
		await Product.findByIdAndUpdate(id, { name, price, category });
		res.redirect(`/products/${id}`);
	})
);
app.delete(
	'/products/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Product.findByIdAndDelete(id);
		res.redirect('/products');
	})
);
app.all('*', (req, res, next) => {
	throw new AppError('Page not found', 404);
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) {
		err.message = 'something went wrong';
	}
	res.status(status).render('error', { err });
});

app.listen(8080, () => {
	console.log('Listening on Port 8080');
});
