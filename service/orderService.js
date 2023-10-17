const BaseError = require("../config/BaseError");
const httpStatusCodes = require("../config/http");
const productModel = require("../model/productModel");
const orderModel = require("../model/orderModel");
const environment = require("../utils/environment");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

module.exports.addOrder = async (data) => {
    const totalPrices = await Promise.all(data.items.map(async (orderItem)=>{
        const product = await productModel.findById(orderItem.product).select("model price sizes -_id");
        const size = product.sizes.find(({size})=> orderItem.size === size);

        if(!size){
            throw new BaseError(`Size: ${orderItem.size} not available in product: ${product.model}`,httpStatusCodes.badRequest);
        }
        
        if(size.quantity < orderItem.quantity){
            throw new BaseError(`Quantity not available for size: ${orderItem.size} in product: ${product.model}`,httpStatusCodes.badRequest);
        }

        const amount = product.price * orderItem.quantity;
        orderItem.buyingPrice = product.price;
        return amount;
    }),);

    var totalAmount = totalPrices.reduce((a,b) => a + b,0);

    if(data.deliveryType === "Fast"){
        totalAmount = totalAmount + 100;
    }

    let order = new orderModel({...data,amount: totalAmount});
    await order.save();
    return order;
}

module.exports.updateOrderPaymentStatus = async (id,data) => {
    const filter = { _id: id };
    const update = {paymentStatus: data.paymentStatus};

    if(data.paymentStatus === "Complete"){
        let completeOrder = await orderModel.findById(id);
        await Promise.all(completeOrder.items.map(async (orderItem)=>{
            const product = await productModel.findById(orderItem.product).select("model price sizes -_id");
            const size = product.sizes.find(({size})=> orderItem.size === size);
    
            await productModel.updateOne({_id:orderItem.product,'sizes.size' : orderItem.size},{$set:{'sizes.$.quantity': size.quantity - orderItem.quantity}})
        }),);
    }

    let order = await orderModel.findOneAndUpdate(filter,update,{returnOriginal: false});
    return order;
}

module.exports.updateOrderStatus = async (id,data) => {
    const filter = { _id: id };
    const update = {status: data.status};

    let order = await orderModel.findOneAndUpdate(filter,update,{returnOriginal: false});
    return order;
}

module.exports.getOrders = async () => {

    let data = await orderModel.find().populate("items.product","model price").sort({createdAt: -1});
    return data;
}

module.exports.getOrdersByUser = async (id) => {
    const filter = {user: id};

    let data = await orderModel.find(filter).populate("items.product","model price").sort({createdAt: -1});
    return data;
}

module.exports.orderCheckout = async (id) => {

    let data = await orderModel.findById(id).populate("items.product","model price");

    const session = await stripe.checkout.sessions.create({
        line_items: data.items.map(item => {
            return {
              price_data: {
                currency: "INR",
                product_data: {
                  name: item.product.model,
                },
                unit_amount: item.buyingPrice * 100,
              },
              quantity: item.quantity,
            }
          }),
        metadata: {
            order_id: id
        },
        payment_method_types: ["card"],
        mode: 'payment',
        success_url: `${environment.CLIENT_URL}/profile?payment=true`,
        cancel_url: `${environment.CLIENT_URL}/profile?payment=false`,
      });
    
    return { url: session.url };
}