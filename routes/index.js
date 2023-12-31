const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

router.get("/", (req, res) => {
	res.render("pages/index");
});

router.get("/game", ensureAuthenticated, (req, res) => {
	res.render("pages/game", {
		user: req.user,
	});
});
module.exports = router;
