const authService = require("../service/authService");
const BaseError = require("../config/BaseError");
const httpStatusCodes = require("../config/http");
const { tryCatch } = require("../utils/tryCatch");

module.exports.register = tryCatch(async function (req, res) {
  let data = req.body;
  let firstName = data.firstName;
  let lastName = data.lastName;
  let email = data.email;
  let password = data.password;

  if (!firstName || !lastName || !email || !password) {
    throw new BaseError("All fields are mandatory", httpStatusCodes.badRequest);
  }

  const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$");

  if (!emailRegex.test(email)) {
    throw new BaseError(
      "Invalid email address format",
      httpStatusCodes.badRequest
    );
  }

  const passwordRegex = new RegExp("^(?=.*[A-Z])(?=.*[!@#$%^&*]).{7,}$");

  if (!passwordRegex.test(password)) {
    throw new BaseError(
      "Invalid password format (Valid values for at least one capital letter, !, @, #, $, %, ^, &, or * one symbol)",
      httpStatusCodes.badRequest
    );
  }

  let user = await authService.register(data);

  return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "User created successfully", user });
});

module.exports.login = tryCatch(async function (req, res) {
  let data = req.body;
  let email = data.email;
  let password = data.password;

  if (!email || !password) {
    throw new BaseError("All fields are mandatory", httpStatusCodes.badRequest);
  }

  const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$");

  if (!emailRegex.test(email)) {
    throw new BaseError(
      "Invalid email address format",
      httpStatusCodes.badRequest
    );
  }

  let token = await authService.login(data);

  return res.status(httpStatusCodes.ok).send({ success: true, message: "Login successfull", token });

});
