const Zone = require('../models/zone.model');

const zonesGetResidentials = async (req, res, next) => {
    try {
        const zones = await Zone.find({ zone: { $ne: "Patrimonial" } });
        return res.status(200).json(zones);
    } catch (err) {
        return next(err);
    }
}
const zonesGetPatrimonials = async (req, res, next) => {
    try {
        const zones = await Zone.find({ zone: "Patrimonial" });
        return res.status(200).json(zones);
    } catch (err) {
        return next(err);
    }
}

const zoneGetOne = async (req, res, next) => {
    try {
        const { id } = req.params;
        const zone = await Zone.findById(id);
        return res.status(200).json(zone);
    } catch (err) {
        return next(err);
    }
}

const zoneCreate = async (req, res, next) => {
    try {
        const newZone = new Zone({
            zone: req.body.zone,
            name: req.body.name,
            id: req.body.id
        })

        const zoneCreated = await newZone.save();

        return res.status(200).json(zoneCreated);

    } catch (err) {
        return next(err);
    }
}

const zoneDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        let response = "";

        const deleted = await Zone.findByIdAndDelete(id);
        if (deleted) response = "Zona borrada de la base de datos";
        else response = "No se ha podido encontrar esta zona. ¿Estás seguro de que existe?";

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    zonesGetResidentials,
    zonesGetPatrimonials,
    zoneGetOne,
    zoneCreate,
    zoneDelete,
}