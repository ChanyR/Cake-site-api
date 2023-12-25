const mongoose = require("mongoose");
const Joi = require("joi");

const cakeSchema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number,
    date_created: {
        type: Date, default: Date.now()
    },
    user_id: String

})

exports.CakeModel = mongoose.model("cakes", cakeSchema);

exports.validatecake = (_bodyValid) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(2).max(1000000).required(),
        category: Joi.string().min(2).max(99).required(),
        img_url: Joi.string().min(0).max(999999999).required(),
        price: Joi.number().min(1).max(9999).required(),
    })
    return joiSchema.validate(_bodyValid);
}