const jwt = require('jsonwebtoken');

module.exports = {
  jwtSign: (user) => {
    const payload = {
      sub: user.id,
      iat: Date.now()
    };
    return jwt.sign(payload, process.env.SECRET_KEY);
  },
  jwtVerify: (token) => {
    return jwt.verify(token, process.env.SECRET_KEY);
  }
};
