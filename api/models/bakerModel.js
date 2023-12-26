const mongoose = require("mongoose");
const Joi = require("joi");

const bakerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  likes: Number,
  comments: Array,
  cake_bases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BasesModel",
    },
  ],
  cake_decorations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DecorationsModel",
    },
  ],
  date_created: {
    type: Date,
    default: Date.now(),
  },
});

exports.BakerModel = mongoose.model("bakers", bakerSchema);

exports.validateBaker = (_bodyValid) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(99).required(),
    email: Joi.string().min(2).max(100).email().required(),
    password: Joi.string().min(6).max(50).required(),
    likes: Joi.number().min(0).max(999999999).required(),
    // comments: Joi.string().min(2).max(99).required(),
    // cake_bases:Joi.string().require(),
    // cake_decorations:Joi.string().require()
  });
  return joiSchema.validate(_bodyValid);
};
