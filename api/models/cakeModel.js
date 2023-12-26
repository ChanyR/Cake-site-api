const mongoose = require("mongoose");
const Joi = require("joi");

const cakeSchema = new mongoose.Schema({
    order_number: String,
    baker_id: String,
    user_id: String,
    cake_base: mongoose.ObjectId,
    cake_decorations: [mongoose.ObjectId],
    order_date: {
        type: Date, default: Date.now()
    },
    price: Number,
    status: {
        type: String,
        enum: ['BAKING', 'DONE', 'SHIPPING','ACCEPTED']
    }
})

exports.CakeModel = mongoose.model("cakes", cakeSchema);

exports.validatecake = (_bodyValid) => {
    let joiSchema = Joi.object({
        order_number: Joi.string().min(2).max(99).required(),
        baker_id: Joi.string().required(),
        cake_base: Joi.string().required(),
        cake_decorations: Joi.required(),
        // cake_decorations: Joi.allow(),
        price: Joi.number().min(1).max(9999).required(),
        status:Joi.required(),
    })
    return joiSchema.validate(_bodyValid);
}