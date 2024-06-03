const express = require("express");
const router = express.Router();

const {handleGetProduct, handleCreateProduct, handleUpdateProduct, handleDeleteProduct, handleGetProductOne} = require('../controllers/product.controller.js');
const {isAuthenticated, authorizeRoles} = require("../middleware/auth.js");


router.get("/getProduct" , handleGetProduct);
router.get("/getProduct/:id", handleGetProductOne);


//Admin Create Route
router.post("/addProduct",isAuthenticated, authorizeRoles('admin'), handleCreateProduct);

//Admin Update Route
router.put("/updateProduct/:id",isAuthenticated, authorizeRoles('admin'), handleUpdateProduct);

//Admin Delete Route
router.delete("/deleteProduct/:id",isAuthenticated, authorizeRoles('admin'), handleDeleteProduct);

module.exports = router;