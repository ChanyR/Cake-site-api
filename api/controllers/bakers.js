const { BakerModel, validateBaker } = require("../models/bakerModel");
const { BasesModel } = require("../models/basesModel");
const { DecorationsModel } = require("../models/decorationsModel");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");

exports.get = async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let data = await BakerModel.find({}).populate({path:'cake_bases',model:'bases'}).populate({path:'cake_decorations',model:'decorations'})
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
    let jsonUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: "baker",
    };
    let user = new UserModel(jsonUser);
    user.password = await bcrypt.hash(user.password, 10);
    let resp = await user.save();

    let jsonBaker = {
      name: req.body.name,
      email: req.body.email,
      user_id: resp._id,
      likes: req.body.likes,
    };
    let baker = new BakerModel(jsonBaker);
    await baker.save();

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
    let dataUser;
    console.log(req.body);
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
    let data;
    if (req.tokenData.role == "admin") {
      let delId = req.params.delId;
      data = await BakerModel.deleteOne({ user_id: delId });
      await UserModel.findByIdAndUpdate(
        delId,
        { role: "user" },
        { new: true }
      );
      res.json(data);
    }
    if (data.deletedCount == 0) {
      res.json({
        msg: "not valid id or you are not allowed to erase. nothing was erased",
      });
    }
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
    let data = await BakerModel.findById(id).populate({path:'cake_bases',model:'bases'}).populate({path:'cake_decorations',model:'decorations'});
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There error, try again later", err });
  }
};

exports.addLikesToBakerById = async (req, res) => {
  let bakerId = req.params.editId;
  let userId = req.tokenData._id;

  try {
    const baker = await BakerModel.findById(bakerId);
    if (!baker) {
      return res.status(404).json({ msg: "Baker not found" });
    }
    const isLiked = baker.likes.includes(userId);
    let updateQuery = {};

    if (isLiked) {
      updateQuery = { $pull: { likes: userId } };
    } else {
      updateQuery = { $addToSet: { likes: userId } };
    }

    let data = await BakerModel.updateOne(
      { _id: bakerId },
      updateQuery
    );

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
        { user_id: bakerId },
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
        { user_id: bakerId },
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

exports.createCommentBaker = async (req, res) => {
  let { bakerId } = req.params;
  let comment = req.body.comment;
  let userId = req.tokenData._id;

  try {
    let baker = await BakerModel.findById(bakerId);
    if (baker) {
      baker = await BakerModel.updateOne(
        { _id: bakerId },
        { $push: { comments: { comment: comment, by_user: userId } } }
      );
    } else {
      baker = { msg: "baker is not exist" };
    }
    res.json(baker);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
};
