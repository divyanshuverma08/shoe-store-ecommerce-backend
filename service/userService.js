const BaseError = require("../config/baseError");
const httpStatusCodes = require("../config/http");
const bcrypt = require('bcrypt');
const userModel = require("../model/userModel");
SALT_WORK_FACTOR = 10;

module.exports.getuser = async (id) => {

    let data = await userModel.findById(id).select("-google.accessToken -google.refreshToken -facebook.accessToken -facebook.refreshToken");

    if(!data){
        throw new BaseError("User not found",httpStatusCodes.notFound)
    }

    let passwordAssigned = true;

    const {password,_id,firstName,lastName,email,google,facebook} = data;
    if(!password){
        passwordAssigned = false;
    }

    return {_id,firstName,lastName,email,google,facebook,passwordAssigned};
}

module.exports.updateUser= async (id,data) => {

    if(data.email){
        let existingUser = await userModel.findOne({email: data.email});
        
        if(existingUser){
            throw new BaseError("Another user already exist with this email", httpStatusCodes.badRequest);
        }
    }

    let user = await userModel.findByIdAndUpdate(id,data,{returnOriginal: false}).select("-google.accessToken -google.refreshToken -facebook.accessToken -facebook.refreshToken --password");
    return user;
}

module.exports.updatePassword= async (id,data) => {

    let user = await userModel.findById(id);

    if(!user){
        throw new BaseError("User not found",httpStatusCodes.notFound)
    }

    if(!user.password){
        throw new BaseError("User does not have a password",httpStatusCodes.badRequest)
    }

    let isMatch = false;

    isMatch = await bcrypt.compare(data.password, user.password);

    if(!isMatch) throw new BaseError("Incorrect Password",httpStatusCodes.unauthorized);

    let newPassword = data.newPassword;

    user.password = newPassword;
    await user.save();

    const {firstName,lastName,email} = user;

    return {firstName,lastName,email};
}

module.exports.setPassword= async (id,data) => {

    let user = await userModel.findById(id);

    if(!user){
        throw new BaseError("User not found",httpStatusCodes.notFound)
    }

    if(user.password){
        throw new BaseError("User have a password use update password api",httpStatusCodes.badRequest)
    }

    user.password = data.password;
    await user.save();

    const {firstName,lastName,email} = user;

    return {firstName,lastName,email};
}
