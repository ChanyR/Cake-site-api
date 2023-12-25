
const { BakerModel,validateBaker } = require("../models/bakerModel");

exports.get=async(req,res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    try {
        let data = await BakerModel.find({})
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


exports.addBaker= async(req, res) => {
    let validBody = validateBaker(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let baker = new BakerModel(req.body);
        baker.user_id = req.tokenData._id;
        await baker.save();
        res.status(201).json(baker);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error to add, try again later", err })
    }
}