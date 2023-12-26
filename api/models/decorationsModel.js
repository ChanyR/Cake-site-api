const mongoose = require("mongoose");
const Joi = require("joi");

const decorationsSchema = new mongoose.Schema({
    price: Number,
    decorations: String,
});

exports.DecorationsModel = mongoose.model("decorations", decorationsSchema);

exports.validatedecorations = (_bodyValid) => {
    let joiSchema = Joi.object({
        price:Joi.number().required().min(10),
        decorations:Joi.string().require(),
    });
    return joiSchema.validate(_bodyValid);
};