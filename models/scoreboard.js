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
		password: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	},
	{ collection: "Scoreboard" }
);

const Score = mongoose.model("Score", ScoreSchema);

module.exports = Score;
