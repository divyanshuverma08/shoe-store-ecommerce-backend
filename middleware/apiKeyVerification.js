const BaseError = require("../config/baseError");
const httpStatusCodes = require("../config/http");
const environment = require("../utils/environment");

const apiKeyVerification = (req, res, next) => {
  const apiKey = req.headers["api-key"];
  if (environment.API_KEY === apiKey) {
    return next();
  }
  throw new BaseError("Unauthorized",httpStatusCodes.unauthorized)
};

module.exports = apiKeyVerification;
