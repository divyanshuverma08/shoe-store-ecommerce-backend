const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types;

const categorySchema = new Schema({
    name:{
        type: String,
        required: true
    },
    products:[{type: ObjectId, ref: "Product"}]
},{timestamps: true});


module.exports = mongoose.model("Category",categorySchema,"categories")