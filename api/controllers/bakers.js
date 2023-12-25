
const { BakerModel,validatecake } = require("../models/bakerModel");

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