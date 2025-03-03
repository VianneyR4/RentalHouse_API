require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
const session = require("express-session");
const passportStrategy = require("./passport");
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(
    session({
        secret: "m87m365vo7bj4d16phlrecgp5a2a3i04",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // Set to true if using HTTPS
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            sameSite: 'lax', // Helps prevent CSRF attacks
            maxAge: 1000 * 60 * 60 * 24 // 24 hours
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:5173",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use("/auth", authRoute);
app.use("/api/v1/", apiRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));