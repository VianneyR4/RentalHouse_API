const jwt = require("jsonwebtoken");

const authToken = (req, res, next) => {
  // Get the token from the request header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: true, message: "Access denied. No token provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user data to the request object
    next();
  } catch (error) {
    res.status(400).json({ error: true, message: "Unauthenticated" });
  }
};

module.exports = authToken;