const { DecorationsModel, validatedecorations } = require("../models/decorationsModel");

exports.get=async(req,res) => {
    try {
        let data = await DecorationsModel.find({})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error, try again later", err })
    }
}

exports.getDecorationById= async (req, res) => {
    try {
        let id = req.params.id;
        let data = await DecorationsModel.findById(id)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error, try again later", err })
    }
}
