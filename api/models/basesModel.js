const mongoose = require("mongoose");
const Joi = require("joi");

const basesSchema = new mongoose.Schema({
    price: Number,
    cake_bases: String,
});

exports.BasesModel = mongoose.model("bases", basesSchema);

exports.validatebases = (_bodyValid) => {
    let joiSchema = Joi.object({
        price:Joi.number().required().min(2),
        cake_base:Joi.string().require(),
    });
    return joiSchema.validate(_bodyValid);
};