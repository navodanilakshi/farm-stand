const mongoose = require('mongoose');
const Product = require('./models/product');

mongoose
	.connect('mongodb://localhost:27017/farmDemo', { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('MONGO CONNECTION OPEN!!!');
	})
	.catch((err) => {
		console.log('OH NO MONGO CONNECTION ERROR!!!!');
		console.log(err);
	});

const seedProducts = [
	{
		name: 'Fairy Eggplant',
		price: 1.0,
		category: 'vegetable'
	},
	{
		name: 'Organic Goddess Melon',
		price: 4.99,
		category: 'fruit'
	},
	{
		name: 'Organic Mini Seedless Watermelon',
		price: 3.99,
		category: 'fruit'
	},
	{
		name: 'Organic Celery',
		price: 1.5,
		category: 'vegetable'
	},
	{
		name: 'Chocolate Whole Milk',
		price: 2.69,
		category: 'dairy'
	}
];

const addProducts = async () => {
	await Product.deleteMany({});
	await Product.insertMany(seedProducts);
};

addProducts().then(() => {
	mongoose.connection.close();
});
