const mongoose = require("mongoose");
const Joi = require("joi");

const defaultCakeBases = [
  "Chocolate",
  "Vanilla",
  "Strawberry",
  "Red Velvet",
  "Lemon",
  "Carrot",
  "Marble",
  "Coconut",
  "Funfetti",
  "Pumpkin Spice",
  "Caramel",
  "Almond",
  "Hazelnut",
  "Mocha",
  "Banana",
  "Raspberry",
  "Blueberry",
  "Pineapple",
  "Coconut",
  "Mint Chocolate Chip"
];

const basesSchema = new mongoose.Schema({
    order_date: {
        type: Date,
        default: Date.now()
    },
    price: Number,
    cake_bases: {
        type: [String],
        default: defaultCakeBases
    }
});

exports.BasesModel = mongoose.model("bases", basesSchema);

exports.validatebases = (_bodyValid) => {
    let joiSchema = Joi.object({
        cake_base:Joi.string().require(),
    });
    return joiSchema.validate(_bodyValid);
};