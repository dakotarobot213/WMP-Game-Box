const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
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
		highScore: {
			type: Number,
			default: 0,
		},
		currScore: {
			type: Number,
			default: 0,
		},
	},
	{ collection: "Users" }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
