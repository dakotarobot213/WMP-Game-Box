const mongoose = require("mongoose");
const ScoreSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		score: {
			type: Number,
			required: true,
		},
	},
	{ collection: "Scoreboard" }
);

const Score = mongoose.model("Score", ScoreSchema);

module.exports = Score;
