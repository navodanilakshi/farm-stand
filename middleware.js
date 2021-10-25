module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You Have to be logged in to view this page!');
		return res.redirect('/login');
	}
	next();
};
