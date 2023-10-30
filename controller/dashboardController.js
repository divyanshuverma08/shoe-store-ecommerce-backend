const BaseError = require("../config/baseError");
const httpStatusCodes = require("../config/http");
const dashboardService = require("../service/dashboardService");
const { tryCatch } = require("../utils/tryCatch");

module.exports.getDashboardDetails = tryCatch(async (req,res) => {

    let response = await dashboardService.getDashboardDetails();

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Dashboard", data: response });
    
});

module.exports.getOrdersByYear = tryCatch(async (req,res) => {

    let response = await dashboardService.getOrdersByYear();

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Dashboard", data: response });
    
});

module.exports.getOrdersByMonth = tryCatch(async (req,res) => {

    let response = await dashboardService.getOrdersByMonth();

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Dashboard", data: response });
    
});

module.exports.getBestSellers = tryCatch(async (req,res) => {

    let response = await dashboardService.getBestSellers();

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Dashboard Best Sellers", data: response });
    
});