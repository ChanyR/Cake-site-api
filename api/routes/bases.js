const express = require("express");
const { auth,authBaker } = require("../middlewares/auth");
const { BasesModel, validatebases } = require("../models/basesModel");
const basesControllers=require("../controllers/bases")
const router = express.Router();

// domain/bases
router.get("/", basesControllers.get)

// domain/bases/:id
router.get("/:id", basesControllers.getBaseById)

module.exports = router;