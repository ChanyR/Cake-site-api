const mongoose = require("mongoose");
const Joi = require("joi");
const { DecorationsModel } = require("./decorationsModel");

const bakerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  likes: Number,
  comments: Array,
  cake_bases: [mongoose.ObjectId],
  cake_decorations: [mongoose.ObjectId],
  date_created: {
    type: Date,
    default: Date.now(),
  },
  role:{
    type:String, default:"baker"
  }
});

exports.BakerModel = mongoose.model("bakers", bakerSchema);

exports.validateBaker = (_bodyValid) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(99).required(),
    email: Joi.string().min(2).max(100).email().required(),
    password: Joi.string().min(6).max(50).required(),
    likes: Joi.number().min(0).max(999999999).required(),
  });
  return joiSchema.validate(_bodyValid);
};
