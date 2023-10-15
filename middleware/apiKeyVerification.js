const BaseError = require("../config/BaseError");
const httpStatusCodes = require("../config/http");

const apiKeyVerification = (req, res, next) => {
  const apiKey = req.headers["api-key"];
  if (process.env.API_KEY === apiKey) {
    return next();
  }
  throw new BaseError("Unauthorized",httpStatusCodes.unauthorized)
};

module.exports = apiKeyVerification;
