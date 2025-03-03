const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { User } = require("./models");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, callback) {
      try {
        // Find or create user
        const [user, created] = await User.findOrCreate({
          where: { googleId: profile.id },
          defaults: {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            role: "renter", // Default role
          },
        });

        // If user exists but some fields might need updating
        if (!created) {
          await user.update({
            name: profile.displayName,
            avatar: profile.photos[0].value,
          });
        }

        // Generate JWT
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" } // Token expires in 1 hour
        );

        // Attach the token to the user object
        user.token = token;

        callback(null, user);
      } catch (error) {
        callback(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});