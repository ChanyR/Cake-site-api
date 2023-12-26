const { BakerModel, validateBaker } = require("../models/bakerModel");
const { BasesModel } = require("../models/basesModel");
const { DecorationsModel } = require("../models/decorationsModel");
const bcrypt = require("bcrypt");

exports.get = async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let data = await BakerModel.find({},{ password: 0 })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There error, try again later", err });
  }
};

exports.addBaker = async (req, res) => {
  let validBody = validateBaker(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let baker = new BakerModel(req.body);
    baker.password = await bcrypt.hash(baker.password, 10);
    await baker.save();
    baker.password = "******";
    res.status(201).json(baker);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There error to add, try again later", err });
  }
};

exports.editBakerById = async (req, res) => {
  let validBody = validateBaker(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let editId = req.params.editId;
    let data;
    if (req.tokenData.role == "admin") {
      data = await BakerModel.updateOne({ _id: editId }, req.body);
    } else {
      data = await BakerModel.updateOne(
        { _id: editId, user_id: req.tokenData._id },
        req.body
      );
    }
    if (data.modifiedCount == 0) {
      res.json({
        msg: "not valid id or you are not allowed to edit. nothing was edited",
      });
    } else res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There error to edit, try again later", err });
  }
};

exports.deleteBakerById = async (req, res) => {
  try {
    let delId = req.params.delId;
    let data;
    if (req.tokenData.role == "admin") {
      data = await BakerModel.deleteOne({ _id: delId });
    } else {
      data = await BakerModel.deleteOne({
        _id: delId,
        user_id: req.tokenData._id,
      });
    }
    if (data.deletedCount == 0) {
      res.json({
        msg: "not valid id or you are not allowed to erase. nothing was erased",
      });
    } else res.json(data);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "There error to delete, try again later", err });
  }
};

exports.getBakerById = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await BakerModel.findById(id);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There error, try again later", err });
  }
};

exports.addLikesToBakerById = async (req, res) => {
  try {
    let id = req.params.editId;
    let data = await BakerModel.findById(id);
    let dataToEdit = data._doc;
    dataToEdit.likes += 1;
    data = await BakerModel.updateOne({ _id: id }, dataToEdit);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There error, try again later", err });
  }
};

exports.createDecorationBaker = async (req, res) => {
  let { decorationId } = req.params;
  let bakerId = req.tokenData._id;

  try {
    let isExistDecoration = await DecorationsModel.findById(decorationId);
    let baker;
    if (isExistDecoration) {
      baker = await BakerModel.updateOne(
        { _id: bakerId },
        { $addToSet: { cake_decorations: { $each: [decorationId] } } }
      );
    } else {
      baker = { msg: "invalid cake's decoration" };
    }
    res.json(baker);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
};

exports.createBaseBaker = async (req, res) => {
    let { baseId } = req.params;
    let bakerId = req.tokenData._id;
  
    try {
      let isExistBase = await BasesModel.findById(baseId);
      let baker;
      if (isExistBase) {
        baker = await BakerModel.updateOne(
          { _id: bakerId },
          { $addToSet: { cake_bases: { $each: [baseId] } } }
        );
      } else {
        baker = { msg: "invalid cake's base" };
      }
      res.json(baker);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err });
    }
  };