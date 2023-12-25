const express = require("express");
const { auth,authBaker } = require("../middlewares/auth");
const { BakerModel,validatecake } = require("../models/bakerModel");
const bakerControllers=require("../controllers/bakers")
const router = express.Router();

// domain/cakes
router.get("/", bakerControllers.get)