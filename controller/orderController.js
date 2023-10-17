const BaseError = require("../config/BaseError");
const httpStatusCodes = require("../config/http");
const orderService = require("../service/orderService");
const { tryCatch } = require("../utils/tryCatch");

module.exports.addOrder = tryCatch(async (req, res) => {
  let data = req.body;
  let user = data.user;
  let items = data.items;
  let email = data.email;
  let firstName = data.firstName;
  let lastName = data.lastName;
  let deliveryAddress = data.deliveryAddress;
  let landmark = data.landmark;
  let city = data.city;
  let state = data.state;
  let pincode = data.pincode;
  let phoneNumber = data.phoneNumber;
  let deliveryType = data.deliveryType;

  if (
    !user ||
    !items ||
    !email ||
    !firstName ||
    !lastName ||
    !deliveryAddress ||
    !landmark ||
    !city ||
    !state ||
    !pincode ||
    !phoneNumber ||
    !deliveryType
  ) {
    throw new BaseError("All fields are mandatory", httpStatusCodes.badRequest);
  }

  let response = await orderService.addOrder(data);

  return res
    .status(httpStatusCodes.ok)
    .send({
      success: true,
      message: "Order created successfully",
      data: response,
    });
});

module.exports.updateOrderPaymentStatus = tryCatch(async (req,res) => {
    const id = req.params.id;

    if(!id){
        throw new BaseError("Id not provided in url", httpStatusCodes.badRequest);
    }

    let data = req.body;
    let paymentStatus = data.paymentStatus;

    if(!paymentStatus){
        throw new BaseError("Payment Status field is mandatory", httpStatusCodes.badRequest);
    }

    const validStatus = ["Pending","Failed","Complete"];

    if(validStatus.indexOf(paymentStatus) < 0){
        throw new BaseError("Invalid value", httpStatusCodes.badRequest);
    }

    let response = await orderService.updateOrderPaymentStatus(id,data);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Order payment status updated", data: response });
    
});

module.exports.updateOrderStatus = tryCatch(async (req,res) => {
    const id = req.params.id;

    if(!id){
        throw new BaseError("Id not provided in url", httpStatusCodes.badRequest);
    }

    let data = req.body;
    let status = data.status;

    if(!status){
        throw new BaseError("Status field is mandatory", httpStatusCodes.badRequest);
    }

    const validStatus = ["Processing","Packed","Transit","Delivered","Canceled"];

    if(validStatus.indexOf(status) < 0){
        throw new BaseError("Invalid value", httpStatusCodes.badRequest);
    }

    let response = await orderService.updateOrderStatus(id,data);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Order status updated", data: response });
    
});

module.exports.getOrders = tryCatch(async (req,res) => {

    let response = await orderService.getOrders();

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Orders", data: response });
    
});

module.exports.getOrdersByUser = tryCatch(async (req,res) => {
    const id = req.params.id;

    if(!id){
        throw new BaseError("Id not provided in url", httpStatusCodes.badRequest);
    }

    let response = await orderService.getOrdersByUser(id);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Orders", data: response });
    
});