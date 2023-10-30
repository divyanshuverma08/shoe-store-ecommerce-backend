const BaseError = require("../config/baseError");
const httpStatusCodes = require("../config/http");
const userService = require("../service/userService");
const { tryCatch } = require("../utils/tryCatch");


module.exports.getUser = tryCatch(async (req,res) => {
    const id = req.params.id;

    if(!id){
        throw new BaseError("Id not provided in url", httpStatusCodes.badRequest);
    }

    if(req.user.id !== id){
        throw new BaseError("You can not access other user data", httpStatusCodes.badRequest);
    }

    let response = await userService.getuser(id);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "User", data: response });
    
});

module.exports.updateUser = tryCatch(async (req,res) => {
    const id = req.params.id;

    if(!id){
        throw new BaseError("Id not provided in url", httpStatusCodes.badRequest);
    }

    if(req.user.id !== id){
        throw new BaseError("You can not update other user data", httpStatusCodes.badRequest);
    }

    let data = req.body;
    let password = data.password;
    let google = data.google;
    let facebook = data.facebook;

    if(password || password?.length === 0){
        throw new BaseError("Password cannot be updated in this api", httpStatusCodes.badRequest);
    }

    if(google || facebook || google?.length === 0 || facebook?.length === 0){
        throw new BaseError("Social accounts cannot be updated using this api", httpStatusCodes.badRequest);
    }

    let response = await userService.updateUser(id,data);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "User updated", data: response });
    
});

module.exports.updatePassword = tryCatch(async (req,res) => {
    let data = req.body;
    let password = data.password;
    let newPassword = data.newPassword;

    if(!password || !newPassword){
        throw new BaseError("Current and New password is mandatory", httpStatusCodes.badRequest);
    }

    const passwordRegex = new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$");

    if (!passwordRegex.test(newPassword)) {
      throw new BaseError(
        "Invalid password format (Minimum 6 letters and least one capital letter and one lowercase letter, !, @, #, $, %, ^, &, or * one symbol)",
        httpStatusCodes.badRequest
      );
    }

    const id = req.user.id;

    let response = await userService.updatePassword(id,data);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "User password updated", data: response });
    
});

module.exports.setPassword = tryCatch(async (req,res) => {
    let data = req.body;
    let password = data.password;

    if(!password){
        throw new BaseError("Password is mandatory", httpStatusCodes.badRequest);
    }

    const passwordRegex = new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$");

    if (!passwordRegex.test(password)) {
      throw new BaseError(
        "Invalid password format (Minimum 6 letters and least one capital letter and one lowercase letter, !, @, #, $, %, ^, &, or * one symbol)",
        httpStatusCodes.badRequest
      );
    }

    const id = req.user.id;

    let response = await userService.setPassword(id,data);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "User password updated", data: response });
    
});