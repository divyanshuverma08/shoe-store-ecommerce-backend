const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const productSchema = new Schema({
    model:{
        type: String,
        required: true
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    color: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        enum: ["Men","Women"],
        required: true
    },
    sizes:[
        {
            size: {
                type: Number,
                enum: [6,7,8,9,10,11,12]
            },
            quantity: Number
        }
    ],
    images: [
        {
            imageUrl: String
        }
    ],
    stock: Number,
    newRelease: {
        type: Boolean,
        default: false
    },
    totalSold: {
        type: Number,
        default: 0
    }
},{timestamps: true});


module.exports = mongoose.model("Product",productSchema)