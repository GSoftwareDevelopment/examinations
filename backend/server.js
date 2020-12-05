const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");

// Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(
	fileUpload({
		limits: { fileSize: process.env.UPLOAD_MAX_SIZE },
		useTempFiles: true,
		tempFileDir: process.env.UPLOAD_TEMP_PATH,
	})
);
app.use(express.json());

app.use(
	cors({
		credentials: true,
	})
);

// Method override middleware
app.use(
	methodOverride(function (req, res) {
		if (req.body && typeof req.body === "object" && "_method" in req.body) {
			// look it urlencoded POST bodies and delete it
			let method = req.body._method;
			delete req.body._method;
			return method;
		}
	})
);

// Logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Session
app.use(
	session({
		secret: "O! LoL its a Tr0ll",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
);

// Passport middleware
// app.use( passport.initialize() );
// app.use( passport.session() );

// Static folder
app.use(process.env.UPLOAD_SERVE_PATH, express.static(process.env.UPLOAD_PATH));

// Authenticate Routes
app.use("/auth", require("./routes/auth"));

// API Routes
app.use(
	"/api/user",
	passport.authenticate("jwt", { session: false }),
	require("./routes/api/user")
);
app.use(
	"/api/examinations",
	passport.authenticate("jwt", { session: false }),
	require("./routes/api/examinations")
);
app.use(
	"/api/groups",
	passport.authenticate("jwt", { session: false }),
	require("./routes/api/groups")
);
app.use(
	"/api/values",
	passport.authenticate("jwt", { session: false }),
	require("./routes/api/values")
);
app.use(
	"/api/measurements",
	passport.authenticate("jwt", { session: false }),
	require("./routes/api/measurements")
);

//
const PORT = process.env.PORT || 3000;

app.listen(
	PORT,
	"0.0.0.0",
	console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
);
