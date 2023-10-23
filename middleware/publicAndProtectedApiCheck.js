const verifyToken = require("./verifyToken");

const publicAndProtectedApiCheck = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    verifyToken(req, res, next);
    return;
  }
  next();
};

module.exports = publicAndProtectedApiCheck;
