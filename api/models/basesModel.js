const mongoose = require("mongoose");
const Joi = require("joi");

const defaultCakeDecorations = [
  "Sprinkles",
  "Fondant Flowers",
  "Edible Glitter",
  "Chocolate Shards",
  "Candied Nuts",
  "Fresh Fruits",
  "Whipped Cream",
  "Ganache Drizzle",
  "Macarons",
  "White Chocolate Curls",
  "Berries",
  "Caramel Sauce",
  "Nuts",
  "Mint Leaves",
  "Oreo Crumbs",
  "Coconut Flakes",
  "Marshmallows",
  "Candy Canes",
  "Rainbow Sprinkles",
  "Gold Leaf"
];

const decorationsSchema = new mongoose.Schema({
    order_date: {
        type: Date,
        default: Date.now()
    },
    price: Number,
    decorations: {
        type: [String],
    //  default: defaultCakeDecorations
    }
});

exports.DecorationsModel = mongoose.model("decorations", decorationsSchema);

exports.validatedecorations = (_bodyValid) => {
    let joiSchema = Joi.object({
        // Define your validation rules here
    });
    return joiSchema.validate(_bodyValid);
};