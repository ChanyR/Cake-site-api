const express = require("express");
const { auth,authBaker } = require("../middlewares/auth");
const { BakerModel,validateBaker } = require("../models/bakerModel");
const bakerControllers=require("../controllers/bakers")
const router = express.Router();

// domain/cakes
router.get("/", bakerControllers.get)

router.post("/", auth, bakerControllers.addBaker)


module.exports = router;