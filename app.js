const express = require("express");
const app = express();
const morgan = require("morgan");
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
		app.listen(PORT, console.log("Server listening on port 5000"));
	} catch (error) {
		console.log(error);
	}
};

initServer();
