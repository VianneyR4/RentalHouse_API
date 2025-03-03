const router = require("express").Router();
const passport = require("passport");
const authToken = require("../middleware/authToken");
const jwtUtils = require("../utils/jwt.utils")


router.get("/login/success", (req, res) => {

  console.log("Session ID:", req.sessionID);
  console.log("Session is auth:", req.isAuthenticated());
  // console.log(req.user.User);

  if (req.user) {

    let newUser = req.user;
    newUser.token = jwtUtils.generateTokenForUser(req.user);

    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      user: newUser,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get("/google/callback", passport.authenticate("google", { 
    successRedirect: process.env.CLIENT_URL, failureRedirect: "/login/failed" 
  }),(req, res) => {

      let newUser = req.user;
      newUser.token = jwtUtils.generateTokenForUser(req.user);

      res.status(200).json({
        error: false,
        message: "Successfully Logged In",
        user: newUser,
        token: newUser.token,
      });
      
    }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
      if (err) {
          return res.status(500).json({ error: true, message: "Logout failed", details: err });
      }

      req.session.destroy((err) => {
          if (err) {
              return res.status(500).json({ error: true, message: "Session destruction failed", details: err });
          }
          res.clearCookie("connect.sid");
          res.status(200).json({ error: false, message: "Successfully logged out" });
      });
  });
});

router.get("/protected", authToken, (req, res) => {
	res.status(200).json({
		error: false,
		message: "You have access to this protected route.",
		user: req.user,
	});
});

module.exports = router;