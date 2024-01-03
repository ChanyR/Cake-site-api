const express = require("express");
const {
  UserModel,
  validateUser,
  loginValid,
  createToken,
} = require("../models/userModel");
const { auth, authAdmin } = require("../middlewares/auth");
const userControllers = require("../controllers/users");
const router = express.Router();

// domain/users
router.get("/", userControllers.get);

// domain/users/myInfo
router.get("/myInfo", auth, userControllers.getUserInfo);

// domain/users/usersList
router.get("/usersList", authAdmin, userControllers.getUserList);

// domain/users
router.post("/", userControllers.addUser);

// domain/users/login
router.post("/login", userControllers.login);

// domain/users/:editId
router.put("/:editId", auth, userControllers.editUserById);

// domain/users/changeToBaker/:userId
router.put("/changeToBaker/:userId", authAdmin, userControllers.changeToBaker);

// domain/users/:delId
router.delete("/:delId", auth, userControllers.deleteUserById);

// domain/users/sendEmail
router.post("/sendEmail", userControllers.sendEmail);

// domain/users/resetPassword
router.patch("/resetPassword", userControllers.resetPassword);

// domain/users/isExistEmail/:email
router.get("/isExistEmail/:email", userControllers.isExistEmail);

module.exports = router;
