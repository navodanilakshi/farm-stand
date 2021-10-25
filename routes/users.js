const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
	res.render('users/register');
});

router.post(
	'/register',
	catchAsync(async (req, res) => {
		try {
			const { username, password, email } = req.body;
			const user = new User({ email, username });
			const registeredUser = await User.register(user, password);
			req.login(registeredUser, (err) => {
				if (err) {
					return next(err);
				}
				req.flash('success', 'Welcome to Farm Stand');
				res.redirect('/farms');
			});
		} catch (err) {
			req.flash('error', err.message);
			return res.redirect('/register');
		}
	})
);

router.get('/login', (req, res) => {
	res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
	req.flash('success', 'Welcome Back!');
	const returnTo = req.session.returnTo;
	if (!returnTo) {
		return res.redirect('/farms');
	}
	delete req.session.returnTo;
	res.redirect(returnTo);
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Successfully Logged You Out!');
	res.redirect('/login');
});

module.exports = router;
