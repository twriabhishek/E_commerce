const express = require("express");
const router = express.Router();

const {
  handleRegisterUser,
  handleLoginUser,
  handleLogoutUser,
  handleForgotPassword,
  handleResetPassword,
  handleGetUserDetails,
  handleUpdatePasswordUser,
  handleUpdateUserProfile,
  handleGetAllUser,
  handleGetSingleUser,
  handleUpdateUserRole,
  handleDeleteUser
} = require("../controllers/user.controller.js");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth.js");

//Register User Route
router.post("/register", handleRegisterUser);
router.post("/login", handleLoginUser);
router.post("/password/forgot", handleForgotPassword);
router.put("/password/reset/:token", handleResetPassword);
router.get("/logout", handleLogoutUser);
router.get("/me", isAuthenticated, handleGetUserDetails);
router.put("/password/update", isAuthenticated, handleUpdatePasswordUser);
router.put("/me/update", isAuthenticated, handleUpdateUserProfile);
router.get("/admin/users", isAuthenticated, authorizeRoles('admin'), handleGetAllUser);
router.get("/admin/user/:id", isAuthenticated, authorizeRoles('admin'), handleGetSingleUser);
router.put("/admin/user/:id", isAuthenticated, authorizeRoles('admin'), handleUpdateUserRole);
router.delete("/admin/user/:id", isAuthenticated, authorizeRoles('admin'), handleDeleteUser);


module.exports = router;