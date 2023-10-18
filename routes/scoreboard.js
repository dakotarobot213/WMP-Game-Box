const express = require("express");
const router = express.Router();
const Score = require("../models/score");
module.exports = router;

router.get("/top", (req, res) => {
	res.send({ Hello: "World!" });
});
router.get("/all", (req, res) => {
	Score.find({}).then((scores, err) => {
		let winners = scores.keys();
		res.send(winners);
	});
});
router.post("/new", (req, res) => {
	const { name, score } = req.body;
	if (name && score) {
		new Score({
			name: name,
			score: score,
		})
			.save() // This is a mongoose function to save to our mongodb
			.catch((value) => console.log(`Something went wrong after saving: ${value}`));
	}
});
