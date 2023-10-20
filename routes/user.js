const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");
// const fs = require("fs")

// Login Render
router.get("/login", (req, res) => {
	res.render("pages/login");
});

// Register Render
router.get("/register", (req, res) => {
	res.render("pages/register");
});

// Score updating
router.put("/score", (req, res) => {
	const { score } = req.body;
	const { email, highScore } = req.user;
	if (score > highScore) {
		User.findOneAndUpdate({ email: email }, { $set: { highScore: score } }).then((doc, err) => {
			if (err) {
				res.status(500);
			} else {
				res.status(200);
			}
		});
	}
});

// Score Grabbing
router.get("/score", (req, res) => {
	User.find({}).then((users, error) => {
		let scoreboard = users;
		scoreboard.sort((a, b) => {
			return b.highScore - a.highScore;
		});
		res.json(
			scoreboard
				.map((user) => {
					return { name: user.name, score: user.highScore };
				})
				.slice(0, 9)
		);
	});
});

// Register handle
router.post("/register", (req, res) => {
	const { name, email, password, password2 } = req.body;
	let errors = [];
	// console.log(`Name ${name} email: ${email} pass: ${password}`)
	// Checks if all fields are filled
	if (!name || !email || !password || !password2) {
		errors.push({ msg: "Please fill in all fields" });
	}
	if (name <= 15) {
		errors.push({ msg: "Name cannot be longer then 15 characters" });
	}
	//checks if passwords match
	if (password !== password2) {
		errors.push({ msg: "passwords don't match" });
	}

	// Checks if password is less than six characters
	if (password.length < 6) {
		errors.push({ msg: "password at least six characters" });
	}
	if (errors.length > 0) {
		res.render("register", {
			errors: errors,
			name: name,
			email: email,
			password: password,
		});
	} else {
		// validation passed
		User.findOne({ email: email }).then((user, err) => {
			if (user) {
				errors.push({ msg: "email already registered" });
				// res.render("pages/register", {
				// 	errors: errors,
				// 	name: name,
				// 	email: email,
				// 	password: password,
				// 	password2: password2,
				// });
			} else {
				const newUser = new User({
					name: name,
					email: email,
					password: password,
				});
				// Hash password
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						// Save hash to pass
						newUser.password = hash;
						// Save user
						newUser
							.save() // This is a mongoose function to save to our mongodb
							.then((value) => {
								// console.log(value)
								// req.flash("success_msg", "You have now registered!");
								res.redirect("/user/login");
							})
							.catch((value) => console.log(`Something went wrong after saving: ${value}`));
					});
				});
			}
		});
	}
});

// Login
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/game",
		failureRedirect: "./login",
		// failureFlash: true,
	})(req, res, next);
	// req, res, next is returned down here
});

// Logout
router.get("/logout", (req, res) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
	});
	res.redirect("../../");
});

module.exports = router;
