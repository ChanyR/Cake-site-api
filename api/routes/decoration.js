const express = require("express");
const { auth,authBaker } = require("../middlewares/auth");
const { DecorationsModel, validatedecorations } = require("../models/decorationsModel");
const decorationControllers=require("../controllers/decoration")
const router = express.Router();

// domain/decorations
router.get("/", decorationControllers.get)

// domain/decorations/:id
router.get("/:id", decorationControllers.getDecorationById)

module.exports = router;