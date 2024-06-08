const express = require("express");
const router = express.Router();

const {
  handleGetProduct,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleGetProductOne,
  handleCreateProductReview,
  handleGetProductReview,
  handleDeleteProductReview
} = require("../controllers/product.controller.js");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth.js");

router.get("/getProduct", handleGetProduct);
router.get("/getProduct/:id", handleGetProductOne);

//Admin Create Route
router.post(
  "/admin/addProduct",
  isAuthenticated,
  authorizeRoles("admin"),
  handleCreateProduct
);

//Admin Update Route
router.put(
  "/admin/updateProduct/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  handleUpdateProduct
);

//Admin Delete Route
router.delete(
  "/admin/deleteProduct/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  handleDeleteProduct
);

//Add Update Review route
router.put("/review", isAuthenticated, handleCreateProductReview);

//Gwt All Review route
router.get("/review", handleGetProductReview);

//Delete Review route
router.delete("/review", isAuthenticated, handleDeleteProductReview);

module.exports = router;
