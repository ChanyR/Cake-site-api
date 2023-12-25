const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel, validateUser, loginValid, createToken } = require("../models/userModel");
const { auth, authAdmin } = require("../middlewares/auth");
const userControllers=require("../controllers/users")
const router = express.Router();

// domain/users
router.get("/", userControllers.get)

// domain/users/myInfo
router.get("/myInfo", auth, userControllers.getUserInfo)

// domain/users/usersList
router.get("/usersList", authAdmin, userControllers.getUserList)

// domain/users
router.post("/", userControllers.addUser)

// domain/users/login
router.post("/login", userControllers.login)

// domain/users/:editId
router.put("/:editId", auth, userControllers.editUserById)

// domain/users/:delId
router.delete("/:delId", auth, userControllers.deleteUserById);

module.exports = router;