const express = require("express");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

const {
  handleNewOrder,
  handleGetSingleOrder,
  handleLoggedInUserOrder,
  handleGetAllOrder,
  handleUpdateOrderStatus,
  handleDeleteOrder,
} = require("../controllers/order.controller.js");


//Create Order Route
router.post("/new", isAuthenticated, handleNewOrder);

//Get Single Order
router.get("/:id", isAuthenticated, handleGetSingleOrder);

//Get LoggedIn User Order
router.get("/loggedInUser/orderMe", isAuthenticated, handleLoggedInUserOrder);

//Get All order Route --Admin
router.get("/admin/allOrder", isAuthenticated, authorizeRoles("admin"), handleGetAllOrder);

//Update order Status Route --Admin
router.put("/admin/updateOrder/:id", isAuthenticated, authorizeRoles("admin"), handleUpdateOrderStatus);

//Delete Order Route --Admin
router.delete("/admin/deleteOrder/:id", isAuthenticated, authorizeRoles("admin"), handleDeleteOrder);

module.exports = router;
