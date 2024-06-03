const express = require("express");
const router = express.Router();

const { handleRegisterUser, handleLoginUser, handleLogoutUser } = require("../controllers/user.controller.js");

//Register User Route
router.post("/register", handleRegisterUser);
router.post("/login", handleLoginUser);
router.get("/logout", handleLogoutUser);    

module.exports = router;