const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types;

const orderSchema = new Schema({
    user:{
        type: ObjectId,
        ref: "User",
        required: true
    },
    items:[
        {
            product:{
                type: ObjectId,
                ref: "Product",
                required: true
            },
            buyingPrice: {
                type: Number,
                required: true,
            },
            size: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    deliveryAddress:{
        type: String,
        required: true
    },
    landmark:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    deliveryType:{
        type: String,
        enum:["Standard","Fast"],
        default: "Standard"
    },
    paymentStatus:{
        type: String,
        required: true,
        enum:["Pending","Failed","Complete"],
        default: "Pending"
    },
    status: {
        type: String,
        required: true,
        enum: ["Processing","Packed","Transit","Delivered","Canceled"],
        default: "Processing"
    },
    amount:{
        type: Number,
        required: true
    }
},{timestamps: true});


module.exports = mongoose.model("Order",orderSchema)