const BaseError = require("../config/BaseError");
const httpStatusCodes = require("../config/http");
const bcrypt = require('bcrypt');
const userModel = require("../model/userModel");
const { createToken } = require("../utils/jwt");


module.exports.register = async function(data){
    let oldUser = await userModel.findOne({email: data.email});

    if(oldUser){
        throw new BaseError("Email Already Exist",httpStatusCodes.conflict)
    }

    let user = new userModel(data);
    await user.save();
    
    const payload = {id: user._id,email: user.email};

    const token = createToken(payload)

    return {email: user.email,firstName: user.firstName, lastName: user.lastName,token};
}

module.exports.login = async function(data){
    let user = await userModel.findOne({email: data.email});

    if(!user){
        throw new BaseError("User not found",httpStatusCodes.notFound)
    }

    let isMatch = false;

    isMatch = await bcrypt.compare(data.password, user.password);

    if(!isMatch) throw new BaseError("Incorrect Password",httpStatusCodes.unauthorized)

    const payload = {id: user._id,email: user.email};

    const token = createToken(payload)

    return {email: user.email,firstName: user.firstName, lastName: user.lastName,token};
}