const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/register', (req, res) => {
	res.render('users/register');
});

router.post('/register', async (req, res) => {
	const { username, password, email } = req.body;
	const user = new User({ email, username });
	await User.register(user, password);
	res.redirect('/farms');
});

module.exports = router;
