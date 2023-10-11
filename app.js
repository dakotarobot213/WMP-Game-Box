const express = require("express");
require("dotenv").config();
const connectDB = require("./db/connect.js");
const morgan = require("morgan");
const app = express();
const PORT = 5000;

// Static assets
app.use(express.static("./public"));
// Parse Form Data
app.use(express.urlencoded({ extended: false }));
// Parse JSON Data
app.use(morgan("tiny"));
app.use(express.json());

const initServer = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(PORT, console.log("Server listening on port 5000"));
	} catch (error) {
		console.log(error);
	}
};

initServer();
