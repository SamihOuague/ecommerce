const { jwtVerify } = require('./jwt');

module.exports = {
  isAuth: (req, res, next) => {
    const barear = req.headers.authorization;
    if (barear) {
      const token = barear.split(' ')[1];
      try {
        const verif = jwtVerify(token);
        if (!verif) { return res.status(403).send({ logged: false }); }
      } catch (e) {
        return res.status(403).send({ logged: false });
      }
    } else {
      return res.status(401).send({ logged: false });
    }
    next();
  }
};