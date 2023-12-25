const mongoose = require("mongoose");
const Joi = require("joi");

const cakeSchema = new mongoose.Schema({
    order_number: String,
    baker_id: String,
    user_id: String,
    cake_base: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BasesModel' 
    },
    cake_decorations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DecorationsModel' 
    }],
    order_date: {
        type: Date, default: Date.now()
    },
    price: Number,
})

exports.CakeModel = mongoose.model("cakes", cakeSchema);

exports.validatecake = (_bodyValid) => {
    let joiSchema = Joi.object({
        order_number: Joi.string().min(2).max(99).required(),
        baker_id: Joi.string().require(),
        cake_base: Joi.string().require(),
        cake_decorations: Joi.string().require(),
        price: Joi.number().min(1).max(9999).required(),
    })
    return joiSchema.validate(_bodyValid);
}