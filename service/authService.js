const BaseError = require("../config/baseError");
const httpStatusCodes = require("../config/http");
const bcrypt = require('bcrypt');
const userModel = require("../model/userModel");
const adminModel = require("../model/adminModel")
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

    return {id: user._id,email: user.email,firstName: user.firstName, lastName: user.lastName,token};
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

    return {id: user._id,email: user.email,firstName: user.firstName, lastName: user.lastName,token};
}

module.exports.adminRegister = async function(data){
    let oldUser = await adminModel.findOne({email: data.email});

    if(oldUser){
        throw new BaseError("Email Already Exist",httpStatusCodes.conflict)
    }

    let user = new adminModel(data);
    await user.save();
    
    const payload = {id: user._id,email: user.email};

    const token = createToken(payload)

    return {id: user._id,email: user.email,firstName: user.firstName, lastName: user.lastName,token};
}

module.exports.adminLogin = async function(data){
    let user = await adminModel.findOne({email: data.email});

    if(!user){
        throw new BaseError("User not found",httpStatusCodes.notFound)
    }

    let isMatch = false;

    isMatch = await bcrypt.compare(data.password, user.password);

    if(!isMatch) throw new BaseError("Incorrect Password",httpStatusCodes.unauthorized)

    const payload = {id: user._id,email: user.email};

    const token = createToken(payload)

    return {id: user._id,email: user.email,firstName: user.firstName, lastName: user.lastName,token};
}