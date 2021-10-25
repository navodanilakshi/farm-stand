const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const productRoutes = require('./routes/products');
const farmRoutes = require('./routes/farms');
const userRoutes = require('./routes/users');
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
app.use(
	session({
		secret: 'thisissecret',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false }
	})
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(flash());
//From passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.currentUser = req.user;
	next();
});
app.use('/', userRoutes);
app.use('/products', productRoutes);
app.use('/farms', farmRoutes);

// app.get('/fakeuser', async (req, res) => {
// 	const user = new User({ email: 'navoda@gmail.com', username: 'navoda' });
//
// 	res.send(newUser);
// });

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
