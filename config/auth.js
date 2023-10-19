const ensureAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		// req.isAuthenticated() will return true if user is logged in
		next();
	} else {
		res.redirect("/auth/login");
	}
};

module.exports = { ensureAuthenticated };
// ensureAuthenticated checks that the user is logged in via passport's authentication;
// 	if the user is, then they'll proceed to their requested page
// 	else, they'll be denied access and redirected to the login page
