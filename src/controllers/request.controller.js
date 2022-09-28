const Request = require('./../models/request.model');
const Ad = require('./../models/ad.model');

const requestsGetAll = async (req, res, next) => {
    try {
        const requests = await Request
            .find()
            .populate({ path: 'requestContact', select: 'fullName company email' })
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
            .populate({ path: 'requestContact', select: '_id fullName company email' })
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
        const request = await Request.findById({ _id: id })

        // Query constructor
        let query = Ad.find();

        // Activar esta parte al final de la validación del CRUD
        query.where({ adStatus: "Activo" })

        if (request.requestAdType.length !== 0) query.where({ adType: { $in: request.requestAdType } })
        if (request.requestBuildingType.length !== 0) query.where({ adBuildingType: { $in: request.requestBuildingType } })
        if (request.requestZone.length !== 0) query.where({ zone: { $in: request.requestZone } })

        if (!request.requestSalePrice.salePriceMax) request.requestSalePrice.salePriceMax = 99999999
        if (!request.requestSalePrice.salePriceMin) request.requestSalePrice.salePriceMin = 0
        query.where({
            sale: {
                $gte: { saleValue: request.requestSalePrice.salePriceMin },
                $lte: { saleValue: request.requestSalePrice.salePriceMax + 1 }
            }
        })

        if (!request.requestRentPrice.rentPriceMax) request.requestRentPrice.rentPriceMax = 99999
        if (!request.requestRentPrice.rentPriceMin) request.requestRentPrice.rentPriceMin = 0
        query.where({
            rent: {
                $lte: { rentValue: request.requestRentPrice.rentPriceMax + 1 },
                $gte: { rentValue: request.requestRentPrice.rentPriceMin }
            }
        })

        if (!request.requestBuildSurface.buildSurfaceMax) request.requestBuildSurface.buildSurfaceMax = 9999
        if (!request.requestBuildSurface.buildSurfaceMin) request.requestBuildSurface.buildSurfaceMin = 0
        query.where({
            buildSurface: {
                $gte: request.requestBuildSurface.buildSurfaceMin,
                $lte: request.requestBuildSurface.buildSurfaceMax
            }
        })

        if (!request.requestPlotSurface.plotSurfaceMax) request.requestPlotSurface.plotSurfaceMax = 99999
        if (!request.requestPlotSurface.plotSurfaceMin) request.requestPlotSurface.plotSurfaceMin = 0
        query.where({
            plotSurface: {
                $gte: request.requestPlotSurface.plotSurfaceMin,
                $lte: request.requestPlotSurface.plotSurfaceMax
            }
        })

        if (!request.requestBedrooms.bedroomsMax) request.requestBedrooms.bedroomsMax = 99
        if (!request.requestBedrooms.bedroomsMin) request.requestBedrooms.bedroomsMin = 0
        query.where({
            quality: {
                $lte: { bedrooms: request.requestBedrooms.bedroomsMax },
                $gte: { bedrooms: request.requestBedrooms.bedroomsMin }
            }
        })

        if (!request.requestBathrooms.bathroomsMax) request.requestBathrooms.bathroomsMax = 99
        if (!request.requestBathrooms.bathroomsMin) request.requestBathrooms.bathroomsMin = 0
        query.where({
            quality: {
                $lte: { bathrooms: request.requestBathrooms.bathroomsMax },
                $gte: { bathrooms: request.requestBathrooms.bathroomsMin }
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

        console.log(req.body)
        let query = Ad.find()
        query.where({ adStatus: "Activo" })

        if (req.body.requestAdType.length !== 0) query.where({ adType: { $in: req.body.requestAdType } })
        if (req.body.requestBuildingType.length !== 0) query.where({ adBuildingType: { $in: req.body.requestBuildingType } })
        if (req.body.requestZone.length !== 0) query.where({ zone: { $in: req.body.requestZone } })

        if (!req.body.salePriceMax) req.body.salePriceMax = 99999999
        if (!req.body.salePriceMin) req.body.salePriceMin = 0
        query.and({
            sale: {
                $gte: { saleValue: req.body.salePriceMin },
                $lte: { saleValue: req.body.salePriceMax + 1}
            }
        })

        if (!req.body.rentPriceMax) req.body.rentPriceMax = 99999
        if (!req.body.rentPriceMin) req.body.rentPriceMin = 0
        query.and({
            rent: {
                $gte: { rentValue: req.body.rentPriceMin },
                $lte: { rentValue: req.body.rentPriceMax + 1}
            }
        })

        if (!req.body.buildSurfaceMax) req.body.buildSurfaceMax = 9999
        if (!req.body.buildSurfaceMin) req.body.buildSurfaceMin = 0
        query.where({
            buildSurface: {
                $gte: req.body.buildSurfaceMin,
                $lte: req.body.buildSurfaceMax
            }
        })

        if (!req.body.plotSurfaceMax) req.body.plotSurfaceMax = 99999
        if (!req.body.plotSurfaceMin) req.body.plotSurfaceMin = 0
        query.where({
            plotSurface: {
                $gte: req.body.plotSurfaceMin,
                $lte: req.body.plotSurfaceMax
            }
        })

        if (!req.body.bedroomsMax) req.body.bedroomsMax = 99
        if (!req.body.bedroomsMin) req.body.bedroomsMin = 0
        query.where({
            quality: {
                $lte: { bedrooms: req.body.bedroomsMax },
                $gte: { bedrooms: req.body.bedroomsMin }
            }
        })

        if (!req.body.bathroomsMax) req.body.bathroomsMax = 99
        if (!req.body.bathroomsMin) req.body.bathroomsMin = 0
        query.where({
            quality: {
                $lte: { bathrooms: req.body.bathroomsMax },
                $gte: { bathrooms: req.body.bathroomsMin }
            }
        })

        const ads = await query.exec()

        return res.status(200).json(ads);
    } catch (err) {
        return next(err);
    }
}

const requestCreate = async (req, res, next) => {

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
            requestReference: req.body.requestReference,
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