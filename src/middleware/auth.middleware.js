const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  req.user = null;
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  }
  next();
}

module.exports = auth;
