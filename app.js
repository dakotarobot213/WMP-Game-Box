// Node Modules
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const morgan = require("morgan");

// File fetching
const users = require("./routes/user");

// const scoreboard = require("./routes/scoreboard");
require("./config/passport")(passport);
require("dotenv").config();

// Creating express app
const app = express();

// Static assets
app.use(express.static("./public"));

// Parse Form Data
app.use(express.urlencoded({ extended: false }));

// Parse JSON Data
app.use(morgan("tiny"));
app.use(express.json());

// Express Session
app.use(
	session({
		secret: process.env.SECRET, // Hashed when the user is serialized
		resave: true,
		saveUninitialized: true,
	})
);

// Passport/user middleware
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use("/auth", users);
// app.use("/score", scoreboard);

const initServer = async () => {
	try {
		mongoose.connect(process.env.MONGO_URI, {}).then(() => {
			console.log(`Connected to database on ${process.env.MONGO_URI}`);
		});
		app.listen(process.env.PORT || 5000, console.log(`Server listening on port ${process.env.PORT || 5000}`));
	} catch (error) {
		console.log(error);
	}
};

initServer();
