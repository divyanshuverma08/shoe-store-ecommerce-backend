const BaseError = require("../config/baseError");
const httpStatusCodes = require("../config/http");
const productService = require("../service/productService");
const { tryCatch } = require("../utils/tryCatch");

module.exports.addProduct = tryCatch(async (req,res) => {
    let data = req.body;
    let model = data.model;
    let category = data.category;
    let color = data.color;
    let price = data.price;
    let gender = data.gender;
    let sizes = data.sizes;
    let images = data.images;

    if(!model || !category || !color || !price || !gender){
        throw new BaseError("All fields are mandatory", httpStatusCodes.badRequest);
    }

    if(!Array.isArray(sizes) || sizes.length === 0){
        throw new BaseError("Sizes field should be a array and not empty", httpStatusCodes.badRequest);
    }

    if(!Array.isArray(images) || images.length === 0){
        throw new BaseError("Images field should be a array and not empty", httpStatusCodes.badRequest);
    }

    let response = await productService.addProduct(data);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Product created successfully", data: response });
    
});

module.exports.getFeatured = tryCatch(async (req,res) => {

    let response = await productService.getFeatured();

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Featured Products", data: response });
    
});

module.exports.getProduct = tryCatch(async (req,res) => {
    const id = req.params.id;

    if(!id){
        throw new BaseError("Id not provided in url", httpStatusCodes.badRequest);
    }

    let response = await productService.getProduct(id);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Product", data: response });
    
});

module.exports.updateProduct = tryCatch(async (req,res) => {
    const id = req.params.id;

    if(!id){
        throw new BaseError("Id not provided in url", httpStatusCodes.badRequest);
    }

    let data = req.body;
    let model = data.model;
    let category = data.category;
    let color = data.color;
    let price = data.price;
    let gender = data.gender;
    let sizes = data.sizes;
    let images = data.images;

    if(!model || !category || !color || !price || !gender){
        throw new BaseError("All fields are mandatory", httpStatusCodes.badRequest);
    }

    if(!Array.isArray(sizes)){
        throw new BaseError("Sizes field should be a array", httpStatusCodes.badRequest);
    }

    if(!Array.isArray(images)){
        throw new BaseError("Images field should be a array", httpStatusCodes.badRequest);
    }

    let response = await productService.updateProduct(id,data);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Product updated", data: response });
    
});

module.exports.getAllProductsWithFiltersAndPagination = tryCatch(async (req,res) => {
    let {size,color,category,gender,price,sort} = req.query;
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 9;
    let queryObject = {}
    
    if(size){
        queryObject['sizes.size'] = { $in: size.split(",").map(Number) }
    }

    if(color){
        queryObject.color = { $in: color.split(",") }
    }

    if(category){
        queryObject["category.name"] = { $in: category.split(",") }
    }

    if(gender){
        queryObject.gender = { $in: gender.split(",") }
    }

    if(price){
        queryObject.price = { $gte: parseInt(price.gte), $lte: parseInt(price.lte) };
    }

    if(process.env.NODE_ENV === "development"){
        console.log(queryObject,sort,page,pageSize);
      }

    let response = await productService.getAllProductsWithFiltersAndPagination(queryObject,sort,page,pageSize);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Categories", data: response.data, metadata: response.metadata });
    
});

module.exports.getSearchProducts = tryCatch(async (req,res) => {
    const key = req.params.key;

    if(!key){
        throw new BaseError("key cannot be empty", httpStatusCodes.badRequest);
    }

    let response = await productService.getSearchProducts(key);

    return res
    .status(httpStatusCodes.ok)
    .send({ success: true, message: "Featured Products", data: response });
    
});