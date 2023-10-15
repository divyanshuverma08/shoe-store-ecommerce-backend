const jwt = require("jsonwebtoken");

const expiry = "1d"

module.exports.createToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiry });
}