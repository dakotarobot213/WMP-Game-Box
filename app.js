// Node Modules
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const morgan = require("morgan");
const expressEJSLayout = require("express-ejs-layouts");

// File fetching
const index = require("./routes/index");
const users = require("./routes/user");

// const scoreboard = require("./routes/scoreboard");
require("./config/passport")(passport);
require("dotenv").config();

// Creating express app
const app = express();

// Static assets
app.use(express.static("./public"));

// Sets the EJS as the Express ap view engine. By default, Express will look inside of a views folder when resolving the template files, which is why we had to create a views folder
app.set("view engine", "ejs");
app.use(expressEJSLayout);

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
app.use("/", index); // User Authentication
app.use("/user", users); // User Methods and Authentication

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
