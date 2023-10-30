const BaseError = require("../config/baseError");
const httpStatusCodes = require("../config/http");
const productModel = require("../model/productModel");
const categoryModel = require("../model/categoryModel");

module.exports.addProduct = async (data) => {
  let category = await categoryModel.findOne({ _id: data.category });

  if (!category) {
    throw new BaseError("Provide valid category", httpStatusCodes.conflict);
  }

  var stock = 0;
  for (var i = 0; i < data.sizes.length; i++) {
    stock = stock + data.sizes[i].quantity;
  }

  let product = new productModel({ ...data, stock });
  await product.save();
  category.products.push(product._id);
  await category.save();
  return product;
};

module.exports.getFeatured = async () => {
  let data = await productModel.find().populate("category").sort({ createdAt: -1 }).limit(4);
  return data;
};

module.exports.getProduct = async (id) => {
  const filter = { _id: id };

  let data = await productModel
    .findOne(filter)
    .populate("category", "_id name");
  return data;
};

module.exports.updateProduct = async (id, data) => {
  const filter = { _id: id };

  var stock = 0;
  for (var i = 0; i < data.sizes.length; i++) {
    stock = stock + data.sizes[i].quantity;
  }

  const update = { ...data, stock };

  let product = await productModel
    .findOne(filter)
    .populate("category", "_id name");

  if (data.category) {
    let category = await categoryModel.findOne({ _id: data.category });

    if (!category) {
      throw new BaseError("Provide valid category", httpStatusCodes.conflict);
    }

    if (!category._id.equals(product.category._id)) {
      await categoryModel.findOneAndUpdate(
        { _id: product.category._id },
        { $pull: { products: product._id } }
      );
      category.products.push(product._id);
      await category.save();
    }
  }

  const newProduct = await productModel
    .findOneAndUpdate(filter, update, { returnOriginal: false })
    .populate("category", "_id name");

  return newProduct;
};

module.exports.getAllProductsWithFiltersAndPagination = async (query, sort,page,pageSize) => {
  //pipeline for fetching products according to filters
  const pipeline = [
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $match: query,
    },
    {
      $unwind: "$category"
    }
  ];

  //pipeline to count total products according to filters
  const totalItemspipeline = [...pipeline,  
    { $count: "totalItems" }
  ];

  //condition for sorting according to price
  if (sort) {
    const sortStage = {
      $sort: {
        price: sort === "asc" ? 1 : -1,
      },
    };
    pipeline.push(sortStage);
  }else{
    const sortStage = {
        $sort: {
        createdAt: -1,
        },
      };
      pipeline.push(sortStage);
  }

  //skip and limit stage for pagination
  if (page && pageSize) {
    const skipStage = {
      $skip: (page - 1) * pageSize
    };
    const limitStage = {
      $limit: pageSize
    };
    pipeline.push(skipStage, limitStage);
  }

  //projection stage to select what data to show or remove
  const projectionStage = {
    $project: {
      category: {
        products: 0,
      }
    }
  };

  pipeline.push(projectionStage);

  let [dataResult,totalItemsResult] = await Promise.all([
    productModel.aggregate(pipeline),
    productModel.aggregate(totalItemspipeline)
  ]);

  const totalItems = totalItemsResult[0] ? totalItemsResult[0].totalItems : 0;
  const data = dataResult;

  //calculate total number of pages, to determine next page
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    data,
    metadata: {
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
      hasNextPage,
      hasPreviousPage
    }
  }
};

module.exports.getSearchProducts = async (key) => {

  let data = await productModel.aggregate([{
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    },
  },
  {
    $match: {
      $or:[
        {model: {$regex: key,$options: "i"}},
        {"category.name": {$regex: key,$options: "i"}}
      ]
    },
  }
]);

  return data;
};