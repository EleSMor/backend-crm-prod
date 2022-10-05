const Request = require('./../models/request.model');
const Ad = require('./../models/ad.model');

const requestsGetAll = async (req, res, next) => {
    try {
        const requests = await Request
            .find()
            .populate({ path: 'requestContact', select: 'fullName company email contactComments' })
            .populate({ path: 'requestConsultant', select: 'fullName' })
        return res.status(200).json(requests);
    } catch (err) {
        return next(err);
    }
}

const requestGetOne = async (req, res, next) => {
    try {
        const { id } = req.params;

        const request = await Request.findById(id)
            .populate({ path: 'requestContact', select: '_id fullName company email contactComments notReceiveCommunications' })
            .populate({ path: 'requestConsultant', select: '_id fullName' })
        return res.status(200).json(request);
    } catch (err) {
        return next(err);
    }
}

const requestLastReference = async (req, res, next) => {
    try {
        const lastReference = await Request.find().sort({ requestReference: - 1 });
        let reference = 0
        if (lastReference.length !== 0) reference = lastReference[0].requestReference
        return res.status(200).json(reference);
    } catch (err) {
        return next(err);
    }
}

const requestGetByContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const request = await Request.find({ requestContact: id }).populate({ path: 'requestConsultant', select: 'fullName' });

        return res.status(200).json(request);
    } catch (err) {
        return next(err);
    }
}

const requestGetAdsMatched = async (req, res, next) => {
    try {
        const { id } = req.params;
        let request = await Request.findById({ _id: id })

        // Query constructor
        let query = Ad.find();

        // Activar esta parte al final de la validación del CRUD
        query.where({ adStatus: "Activo" })

        if (request.requestAdType.length !== 0) query.where({ adType: { $in: request.requestAdType } })
        if (request.requestBuildingType.length !== 0) query.where({ adBuildingType: { $in: request.requestBuildingType } })
        if (request.requestZone.length !== 0) query.where({ zone: { $in: request.requestZone } })

        if (!request.requestSalePrice.salePriceMax) request.requestSalePrice.salePriceMax = 999999999
        if (!request.requestSalePrice.salePriceMin) request.requestSalePrice.salePriceMin = 0
        query.where({
            'sale.saleValue': {
                $gte: request.requestSalePrice.salePriceMin,
                $lte: request.requestSalePrice.salePriceMax
            }
        })

        if (!request.requestRentPrice.rentPriceMax) request.requestRentPrice.rentPriceMax = 999999999
        if (!request.requestRentPrice.rentPriceMin) request.requestRentPrice.rentPriceMin = 0
        query.where({
            'rent.rentValue': {
                $lte: request.requestRentPrice.rentPriceMax,
                $gte: request.requestRentPrice.rentPriceMin
            }
        })

        if (!request.requestBuildSurface.buildSurfaceMax) request.requestBuildSurface.buildSurfaceMax = 999999999
        if (!request.requestBuildSurface.buildSurfaceMin) request.requestBuildSurface.buildSurfaceMin = 0
        query.where({
            buildSurface: {
                $gte: request.requestBuildSurface.buildSurfaceMin,
                $lte: request.requestBuildSurface.buildSurfaceMax
            }
        })

        if (!request.requestPlotSurface.plotSurfaceMax) request.requestPlotSurface.plotSurfaceMax = 999999999
        if (!request.requestPlotSurface.plotSurfaceMin) request.requestPlotSurface.plotSurfaceMin = 0
        query.where({
            plotSurface: {
                $gte: request.requestPlotSurface.plotSurfaceMin,
                $lte: request.requestPlotSurface.plotSurfaceMax
            }
        })

        if (!request.requestBedrooms.bedroomsMax) request.requestBedrooms.bedroomsMax = 999
        if (!request.requestBedrooms.bedroomsMin) request.requestBedrooms.bedroomsMin = 0
        query.where({
            'quality.bedrooms': {
                $gte: request.requestBedrooms.bedroomsMin,
                $lte: request.requestBedrooms.bedroomsMax
            }
        })

        if (!request.requestBathrooms.bathroomsMax) request.requestBathrooms.bathroomsMax = 999
        if (!request.requestBathrooms.bathroomsMin) request.requestBathrooms.bathroomsMin = 0
        query.where({
            'quality.bathrooms': {
                $gte: request.requestBathrooms.bathroomsMin,
                $lte: request.requestBathrooms.bathroomsMax
            }
        })

        const ad = await query.exec()

        return res.status(200).json(ad);
    } catch (err) {
        return next(err);
    }
}

const requestGetNewMatched = async (req, res, next) => {
    try {

        let query = Ad.find()
        query.where({ adStatus: "Activo" })

        if (req.body.requestAdType.length !== 0) query.where({ adType: { $in: req.body.requestAdType } })
        if (req.body.requestBuildingType.length !== 0) query.where({ adBuildingType: { $in: req.body.requestBuildingType } })
        if (req.body.requestZone.length !== 0) query.where({ zone: { $in: req.body.requestZone } })

        if (!req.body.salePriceMax) req.body.salePriceMax = 999999999
        if (!req.body.salePriceMin) req.body.salePriceMin = 0
        query.and({
            'sale.saleValue': {
                $gte: req.body.salePriceMin,
                $lte: req.body.salePriceMax
            }
        })

        if (!req.body.rentPriceMax) req.body.rentPriceMax = 999999999
        if (!req.body.rentPriceMin) req.body.rentPriceMin = 0
        query.and({
            'rent.rentValue': {
                $gte: req.body.rentPriceMin,
                $lte: req.body.rentPriceMax
            }
        })

        if (!req.body.buildSurfaceMax) req.body.buildSurfaceMax = 999999999
        if (!req.body.buildSurfaceMin) req.body.buildSurfaceMin = 0
        query.where({
            buildSurface: {
                $gte: req.body.buildSurfaceMin,
                $lte: req.body.buildSurfaceMax
            }
        })

        if (!req.body.plotSurfaceMax) req.body.plotSurfaceMax = 999999999
        if (!req.body.plotSurfaceMin) req.body.plotSurfaceMin = 0
        query.where({
            plotSurface: {
                $gte: req.body.plotSurfaceMin,
                $lte: req.body.plotSurfaceMax
            }
        })

        if (!req.body.bedroomsMax) req.body.bedroomsMax = 999
        if (!req.body.bedroomsMin) req.body.bedroomsMin = 0
        query.where({
            'quality.bedrooms': {
                $gte: req.body.bedroomsMin,
                $lte: req.body.bedroomsMax
            }
        })

        if (!req.body.bathroomsMax) req.body.bathroomsMax = 999
        if (!req.body.bathroomsMin) req.body.bathroomsMin = 0
        query.where({
            'quality.bathrooms': {
                $gte: req.body.bathroomsMin,
                $lte: req.body.bathroomsMax
            }
        })

        const ads = await query.exec()

        return res.status(200).json(ads);
    } catch (err) {
        return next(err);
    }
}

const requestCreate = async (req, res, next) => {

    let reference = await Request.find().sort({ requestReference: - 1 });
    reference = reference[0].requestReference + 1;
    try {
        const requestSalePrice = {
            salePriceMax: req.body.salePriceMax,
            salePriceMin: req.body.salePriceMin
        }

        const requestRentPrice = {
            rentPriceMax: req.body.rentPriceMax,
            rentPriceMin: req.body.rentPriceMin
        }

        const requestBuildSurface = {
            buildSurfaceMax: req.body.buildSurfaceMax,
            buildSurfaceMin: req.body.buildSurfaceMin
        }

        const requestPlotSurface = {
            plotSurfaceMax: req.body.plotSurfaceMax,
            plotSurfaceMin: req.body.plotSurfaceMin
        }

        const requestBedrooms = {
            bedroomsMax: req.body.bedroomsMax,
            bedroomsMin: req.body.bedroomsMin
        }

        const requestBathrooms = {
            bathroomsMax: req.body.bathroomsMax,
            bathroomsMin: req.body.bathroomsMin
        }

        const newRequest = new Request({
            requestContact: req.body.requestContact,
            requestConsultant: req.body.requestConsultant,
            requestComment: req.body.requestComment,
            requestAdType: req.body.requestAdType,
            requestBuildingType: req.body.requestBuildingType,
            requestPlotSurface,
            requestBedrooms,
            requestBathrooms,
            requestReference: reference,
            requestZone: req.body.requestZone,
            requestSalePrice,
            requestRentPrice,
            requestBuildSurface,
        })

        const requestCreated = await newRequest.save();

        return res.status(200).json(requestCreated);
    } catch (err) {
        return next(err);
    }
}

const requestUpdate = async (req, res, next) => {

    try {
        let fieldsToUpdate = {};

        fieldsToUpdate.requestContact = req.body.requestContact
        fieldsToUpdate.requestConsultant = req.body.requestConsultant
        fieldsToUpdate.requestComment = req.body.requestComment
        fieldsToUpdate.requestAdType = req.body.requestAdType
        fieldsToUpdate.requestBuildingType = req.body.requestBuildingType
        fieldsToUpdate.requestReference = req.body.requestReference
        fieldsToUpdate.requestZone = req.body.requestZone;

        fieldsToUpdate.requestSalePrice = {
            salePriceMax: req.body.salePriceMax,
            salePriceMin: req.body.salePriceMin
        }

        fieldsToUpdate.requestRentPrice = {
            rentPriceMax: req.body.rentPriceMax,
            rentPriceMin: req.body.rentPriceMin
        }

        fieldsToUpdate.requestBuildSurface = {
            buildSurfaceMax: req.body.buildSurfaceMax,
            buildSurfaceMin: req.body.buildSurfaceMin
        }

        fieldsToUpdate.requestPlotSurface = {
            plotSurfaceMax: req.body.plotSurfaceMax,
            plotSurfaceMin: req.body.plotSurfaceMin
        }

        fieldsToUpdate.requestBedrooms = {
            bedroomsMax: req.body.bedroomsMax,
            bedroomsMin: req.body.bedroomsMin
        }

        fieldsToUpdate.requestBathrooms = {
            bathroomsMax: req.body.bathroomsMax,
            bathroomsMin: req.body.bathroomsMin
        }

        const updatedRequest = await Request.findByIdAndUpdate(req.body.id, fieldsToUpdate, { new: true })

        return res.status(200).json(updatedRequest);

    } catch (err) {
        return next(err);
    }
}

const requestDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        let response = "";

        const deleted = await Request.findByIdAndDelete(id);
        if (deleted) response = "Petición borrada de la base de datos";
        else response = "No se ha podido encontrar esta petición. ¿Estás seguro de que existe?";

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    requestsGetAll,
    requestGetOne,
    requestLastReference,
    requestGetByContact,
    requestGetAdsMatched,
    requestGetNewMatched,
    requestCreate,
    requestUpdate,
    requestDelete,
}
