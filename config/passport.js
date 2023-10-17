const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = function (passport) {
	passport.use(
		// 'SELECT * FROM users WHERE username = ?', [ username ], function(err, row)
		// LocalStrategy if a method of authentication to use our own resources instead of an alternative auth like OAuth
		new LocalStrategy({ usernameField: "email", passwordField: "password", passReqToCallback: false, session: true }, (email, password, done) => {
			console.log("Local Strat Works");
			// Match User
			User.findOne({ email: email })
				.then((user) => {
					if (!user) {
						return done(null, false, { message: "that email is not registered" });
					}
					// Match pass
					bcrypt.compare(password, user.password, (err, isMatch) => {
						if (err) throw err;

						if (isMatch) {
							console.log(email + " " + password);
							return done(null, user);
						} else {
							return done(null, false, { message: "pass incorrect" });
						}
					});
				})
				.catch((err) => {
					console.log(err);
				});
		})
	);
	// These are to handle the login sessions
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id)
			.then((user, err) => {
				console.log(err);
				if (err) return done(err);
				done(err, user);
			})
			.catch((err) => {
				console.log(err);
			});
	});
};
