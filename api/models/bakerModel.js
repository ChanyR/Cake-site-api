const mongoose = require("mongoose");
const Joi = require("joi");

const bakerSchema = new mongoose.Schema({
    name: String,
    likes: Number,
    comments: Array,
    cake_bases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BasesModel' 
    }],
    cake_decorations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Decorations' 
    }],
    date_created: {
        type: Date, default: Date.now()
    }
})

exports.CakeModel = mongoose.model("cakes", bakerSchema);

exports.validatecake = (_bodyValid) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        likes: Joi.number().min(0).max(999999999).required(),
        comments: Joi.string().min(2).max(99).required(),
        cake_bases:Joi.string().require(),
        cake_decorations:Joi.string().require()
    })
    return joiSchema.validate(_bodyValid);
}