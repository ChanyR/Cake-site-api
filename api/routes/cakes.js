const express = require("express");
const { auth,authBaker } = require("../middlewares/auth");
const { CakeModel, validatecake } = require("../models/cakeModel");
const cakeControllers=require("../controllers/cakes")
const router = express.Router();

// domain/cakes
router.get("/", cakeControllers.get)

// domain/cakes/search
router.get("/search", cakeControllers.search)

// domain/cakes/category/:catname
router.get("/category/:catname", cakeControllers.getByCategory)

// domain/cakes
router.post("/", authBaker, cakeControllers.addCake)

// domain/cakes/:editId
router.put("/:editId", authBaker, cakeControllers.editCakeById)

// domain/cakes/:delId
router.delete("/:delId", authBaker, cakeControllers.deleteCakeById)

// domain/cakes/prices
router.get("/prices", cakeControllers.getByPrices)

// domain/cakes/single/:id
router.get("/single/:id", cakeControllers.getCakeById)

module.exports = router;