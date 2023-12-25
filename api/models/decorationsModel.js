const mongoose = require("mongoose");
const Joi = require("joi");

const basesSchema = new mongoose.Schema({
   
    order_date: {
        type: Date, default: Date.now()
    },
    price:Number,
})

exports.DecorationsModel = mongoose.model("decorations", basesSchema);

exports.validatebases = (_bodyValid) => {
    let joiSchema = Joi.object({
        
    })
    return joiSchema.validate(_bodyValid);
}