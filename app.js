const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');

const productRoutes = require('./routes/products');
const farmRoutes = require('./routes/farms');
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
app.use('/products', productRoutes);
app.use('/farms', farmRoutes);

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
