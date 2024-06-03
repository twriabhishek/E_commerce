const express = require("express");
const router = express.Router();

const { handleRegisterUser, handleLoginUser, handleLogoutUser, handleForgotPassword, handleResetPassword} = require("../controllers/user.controller.js");

//Register User Route
router.post("/register", handleRegisterUser);
router.post("/login", handleLoginUser);
router.post("/password/forgot",  handleForgotPassword);
router.put("/password/reset/:token",  handleResetPassword);

router.get("/logout", handleLogoutUser);    


module.exports = router;