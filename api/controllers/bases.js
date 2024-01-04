const { BasesModel, validatebases } = require("../models/basesModel");

exports.get=async(req,res) => {
    try {
        let data = await BasesModel.find({})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error, try again later", err })
    }
}

exports.getBaseById= async (req, res) => {
    try {
        let id = req.params.id;
        let data = await BasesModel.findById(id)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There error, try again later", err })
    }
}
