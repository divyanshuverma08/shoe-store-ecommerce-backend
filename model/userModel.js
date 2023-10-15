const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String
    },
    firstName: String,
    lastName: String,
    google:{
        id: String,
        name: String,
        email: String,
        accessToken: String,
        refreshToken: String,
        tokenExpiry: String
    },
    facebook:{
        id: String,
        name: String,
        email: String,
        accessToken: String,
        refreshToken: String,
        tokenExpiry: String
    },
    twitter:{
        id: String,
        name: String,
        email: String,
        accessToken: String,
        refreshToken: String,
        tokenExpiry: String
    }
},{timestamps: true});

userSchema.pre('save', function(next) {
    var user = this;
    if(!user.password){
        next()
    }

    bcrypt.hash(user.password,SALT_WORK_FACTOR, function(err, hash) {
        if (err) return next(err);

        // Store hash in your password DB.
        user.password = hash;
        next();
    });
});

module.exports = mongoose.model("User",userSchema)