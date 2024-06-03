const Product = require("../models/product.model.js");
const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const ApiFeatures = require("../utils/apifeatures.js");

const handleGetProduct = catchAsyncError(async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({ success: true, products, productCount });
});

const handleGetProductOne = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not found", 404));
  }

  res.status(200).json({ success: true, product });
});


//Admin Create Controller
const handleCreateProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(200).json({ message: "Created Successfully" });
});


//Admin Update Controller
const handleUpdateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, product });
});

//Admin Delete Controller
const handleDeleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not found", 404));
  }
  await Product.deleteOne({ _id: req.params.id });
  res
    .status(200)
    .json({ success: true, message: "Product deleted Successfully" });
});

module.exports = {
  handleGetProduct,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleGetProductOne,
};
