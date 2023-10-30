const BaseError = require("../config/baseError");
const httpStatusCodes = require("../config/http");
const categoryService = require("../service/categoryService");
const { tryCatch } = require("../utils/tryCatch");

module.exports.addCategory = tryCatch(async (req,res) => {
    let data = req.body;
    let name = data.name;

    if(!name){
        throw new BaseError("All fields are mandatory", httpStatusCodes.badRequest);
    }

    let response = await categoryService.addCategory(data);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Category created successfully", data: response });
    
});


module.exports.getCategories = tryCatch(async (req,res) => {

    let response = await categoryService.getCategories();

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Categories", data: response });
    
});

module.exports.getCategory = tryCatch(async (req,res) => {
    const id = req.params.id;

    if(!id){
        throw new BaseError("Id not provided in url", httpStatusCodes.badRequest);
    }

    let response = await categoryService.getCategory(id);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Category", data: response });
    
});

module.exports.updateCategory = tryCatch(async (req,res) => {
    const id = req.params.id;

    if(!id){
        throw new BaseError("Id not provided in url", httpStatusCodes.badRequest);
    }

    let data = req.body;
    let name = data.name;
    let products = data.products;

    if(!name){
        throw new BaseError("Name field is mandatory", httpStatusCodes.badRequest);
    }

    if(products){
        throw new BaseError("Products can not be updated in this API", httpStatusCodes.badRequest);
    }

    let response = await categoryService.updateCategory(id,data);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Category updated", data: response });
    
});