const { CakeModel, validatecake } = require("../models/cakeModel");

exports.get=async(req,res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    try {
        let data = await CakeModel.find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ _id: -1 })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error, try again later", err })
    }
}

exports.search=async(req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    try {
        let queryS = req.query.s;
        let searchReg = new RegExp(queryS, "i")
        let data = await CakeModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ _id: -1 })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error to search, try again later", err })
    }
}


exports.getByCategory= async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    try {
        let category = req.params.catname;
        let searchReg = new RegExp(category, "i")
        let data = await CakeModel.find({ category: searchReg })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ _id: -1 })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error, try again later", err })
    }
}

exports.addCake= async(req, res) => {
    let validBody = validatecake(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let cake = new CakeModel(req.body);
        cake.user_id = req.tokenData._id;
        await cake.save();
        res.status(201).json(cake);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error to add, try again later", err })
    }
}

exports.editCakeById= async(req, res) => {
    let validBody = validatecake(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let editId = req.params.editId;
        let data;
        if (req.tokenData.role == "admin") {
            data = await CakeModel.updateOne({ _id: editId }, req.body)
        }
        else {
            data = await CakeModel.updateOne({ _id: editId, user_id: req.tokenData._id }, req.body)
        }
        if (data.modifiedCount == 0) {
            res.json({ msg: "not valid id or you are not allowed to edit. nothing was edited" })
        }
        else res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error to edit, try again later", err })
    }
}

exports.deleteCakeById= async (req, res) => {
    try {
        let delId = req.params.delId;
        let data;
        if (req.tokenData.role == "admin") {
            data = await CakeModel.deleteOne({ _id: delId })
        }
        else {
            data = await CakeModel.deleteOne({ _id: delId, user_id: req.tokenData._id })
        }
        if (data.deletedCount == 0) {
            res.json({ msg: "not valid id or you are not allowed to erase. nothing was erased" })
        }
        else res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error to delete, try again later", err })
    }
}

exports.getByPrices= async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    try {
        let min = req.query.min || 0;
        let max = req.query.max || Infinity;
        let data = await CakeModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ _id: -1 })
        res.json(data)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error, try again later", err })
    }
}

exports.getCakeById= async (req, res) => {
    try {
        let id = req.params.id;
        let data = await CakeModel.findById(id)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error, try again later", err })
    }
}