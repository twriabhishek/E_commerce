const Order = require("../models/order.model.js");
const Product = require("../models/product.model.js");
const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");

//Create New Order
const handleNewOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});

//Get Single Order
const handleGetSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(
      new ErrorHandler(`Order Not found with this Id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//Get Logged In User Order
const handleLoggedInUserOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//Get All Orders --Admin
const handleGetAllOrder = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//Update Order Status --Admin
const handleUpdateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorHandler(`Order Not found with this Id: ${req.params.id}`, 404)
    );
  }
  
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 404));
  }

  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

//Delete Orders --Admin
const handleDeleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorHandler(`Order Not found with this Id: ${req.params.id}`, 404)
    );
  }

  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}

module.exports = {
  handleNewOrder,
  handleGetSingleOrder,
  handleLoggedInUserOrder,
  handleGetAllOrder,
  handleUpdateOrderStatus,
  handleDeleteOrder,
};
