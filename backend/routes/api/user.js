const path = require("path");
const express = require("express");
const router = express.Router();

const User = require("../../models/user");

// @desc    Get user information if logged
// @route   GET /user
// @return  JSON data
router.get("/", async (req, res, next) => {
	if (req.user) {
		res.json(req.user);
	} else {
		res.json({ error: "Access denied! You are not authorized" });
	}
});

// @desc		Update user information
// @route		POST /user
// @return	JSON data
router.post("/", async (req, res, next) => {
	let userData = {};

	if (req.files) {
		try {
			const image = req.files.image;
			const ext = path.extname(image.name);
			const filename = req.user._id + ext;
			const adr = "http://" + req.socket._peername.address + ":" + process.env.PORT + "/uploaded/";

			image.mv(process.env.UPLOAD_PATH + filename);
			userData.image = adr + filename;
		} catch (error) {
			return res.json({ error });
		}
	}

	if (req.body.displayName) userData.displayName = req.body.displayName;
	if (req.body.firstName) userData.firstName = req.body.firstName;
	if (req.body.lastName) userData.lastName = req.body.lastName;

	// update data in DB
	try {
		await User.findOneAndUpdate({ _id: req.user._id }, userData);

		req.user = { ...req.user, ...userData };
		return res.json({ OK: 1, updated: userData });
	} catch (error) {
		return res.json({ error });
	}
});

module.exports = router;
