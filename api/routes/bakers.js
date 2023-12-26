const express = require("express");
const { auth,authBaker, authAdmin } = require("../middlewares/auth");
const { BakerModel,validateBaker } = require("../models/bakerModel");
const bakerControllers=require("../controllers/bakers")
const router = express.Router();

// domain/bakers
router.get("/", bakerControllers.get)

// domain/bakers/:id
router.get("/:id", bakerControllers.getBakerById)

// domain/bakers
router.post("/", authAdmin, bakerControllers.addBaker)

// domain/bakers/:editId
router.put("/:editId", authBaker, bakerControllers.editBakerById)

// domain/bakers/likes/:editId
router.put("/likes/:editId", auth, bakerControllers.addLikesToBakerById)

// domain/bakers/:delId
router.delete("/:delId", authAdmin, bakerControllers.deleteBakerById)

module.exports = router;