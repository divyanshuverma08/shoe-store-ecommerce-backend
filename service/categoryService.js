const BaseError = require("../config/baseError");
const httpStatusCodes = require("../config/http");
const categoryModel = require("../model/categoryModel");

module.exports.addCategory = async (data) => {
    let oldCategory = await categoryModel.findOne({name: data.name});

    if(oldCategory){
        throw new BaseError("Category already exist with same name",httpStatusCodes.conflict)
    }

    let category = new categoryModel(data);
    await category.save();
    return category;
}

module.exports.getCategories = async () => {

    let data = await categoryModel.find().sort({createdAt: -1});
    return data;
}

module.exports.getCategory = async (id) => {
    const filter = { _id: id };

    let data = await categoryModel.findOne(filter).populate("products");
    return data;
}

module.exports.updateCategory = async (id,data) => {
    const filter = { _id: id };
    const update = {name: data.name};

    let category = await categoryModel.findOneAndUpdate(filter,update,{returnOriginal: false});
    return category;
}