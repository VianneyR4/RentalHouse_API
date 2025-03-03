const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = process.env.JWT_SECRET

module.exports = {
  generateTokenForUser: function(userData) {
    return jwt.sign({
      userId: userData.id,
      userName: userData.name,
      userEmail: userData.email,
      userRole: userData.role,
      userAvatar: userData.avatar
    },
    JWT_SIGN_SECRET,
    {
      expiresIn: '1h'
    })
  },
  parseAuthorization: function(authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },
  getUserData: function(authorization) {
    var userData = {};
    var token = module.exports.parseAuthorization(authorization);
    if(token != null) {
      try {
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if(jwtToken != null)
          userData = jwtToken;
      } catch(err) { }
    }
    return userData;
  }
}