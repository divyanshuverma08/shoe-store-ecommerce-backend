const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    firstName:{
        type:String,
        //required:true
    },
    lastName:{
        type:String,
        //required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},
{timestamps:true}
);

adminSchema.pre('save', function(next) {
    var user = this;

    bcrypt.hash(user.password,SALT_WORK_FACTOR, function(err, hash) {
        if (err) return next(err);

        // Store hash in your password DB.
        user.password = hash;
        next();
    });
});


module.exports = mongoose.model("Admin",adminSchema,"Admins");