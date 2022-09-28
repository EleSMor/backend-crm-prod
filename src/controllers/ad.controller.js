const Ad = require('./../models/ad.model');
const Request = require('./../models/request.model');
const { deleteImage } = require('../middlewares/file.middleware');

const adGetAll = async (req, res, next) => {
    try {
        const ads = await Ad
            .find()
            .populate({ path: 'owner', select: 'fullName' })
            .populate({ path: 'consultant', select: 'fullName' })
            .populate({ path: 'zone', select: 'zone name' })
        return res.status(200).json(ads);
    } catch (err) {
        return next(err);
    }
}

const adGetMatchedRequests = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ad = await Ad.findById({ _id: id })

        // Query constructor
        let query = Request.find();

        if (ad.adType.length !== 0) query.where({ requestAdType: { $in: ad.adType } })
        if (ad.adBuildingType.length !== 0) query.where({ requestBuildingType: { $in: ad.adBuildingType } })
        if (ad.zone.length !== 0) query.where({ requestZone: { $in: ad.zone } })

        if (!ad.sale.saleValue) ad.sale.saleValue = 0;
        query.where({
            requestSalePrice: {
                $gte: { salePriceMax: ad.sale.saleValue },
                $lte: { salePriceMin: ad.sale.saleValue }
            },
        })

        if (!ad.rent.rentValue) ad.rent.rentValue = 0;
        query.where({
            requestRentPrice: {
                $gte: { rentPriceMax: ad.rent.rentValue },
                $lte: { rentPriceMin: ad.rent.rentValue }
            },
        })

        if (!ad.buildSurface) ad.buildSurface = 0;
        query.where({
            requestBuildSurface: {
                $gte: { buildSurfaceMax: ad.buildSurface },
                $lte: { buildSurfaceMin: ad.buildSurface }
            }
        })

        if (!ad.plotSurface) ad.plotSurface = 0;
        query.where({
            requestPlotSurface: {
                $gte: { plotSurfaceMax: ad.plotSurface },
                $lte: { plotSurfaceMin: ad.plotSurface }
            },
        })


        if (!ad.quality.bedrooms) ad.quality.bedrooms = 0;
        query.where({
            requestBedrooms: {
                $gte: { bedroomsMax: ad.quality.bedrooms },
                $lte: { bedroomsMin: ad.quality.bedrooms }
            },
        })

        if (!ad.quality.bathrooms) ad.quality.bathrooms = 0;
        query.where({
            requestBathrooms: {
                $gte: { bathroomsMax: ad.quality.bathrooms },
                $lte: { bathroomsMin: ad.quality.bathrooms }
            },
        })


        query.populate({ path: 'requestContact', select: 'fullName company email consultantComments' })

        if (ad.adStatus === "Activo") {
        const requests = await query.exec()
        return res.status(200).json(requests);
        } else {
            return next();
        }

    } catch (err) {
        return next(err);
    }
}

const adGetOne = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ad = await Ad.findById(id);
        return res.status(200).json(ad);
    } catch (err) {
        return next(err);
    }
};

const adCreate = async (req, res, next) => {
    try {

        const adDirection = {
            address: {
                street: req.body.street,
                directionNumber: req.body.directionNumber,
                directionFloor: req.body.directionFloor ? req.body.directionFloor : ""
            },
            postalCode: req.body.postalCode ? req.body.postalCode : "",
            city: req.body.city ? req.body.city : "",
            country: req.body.country ? req.body.country : ""
        };

        const sale = {
            saleValue: req.body.saleValue,
            saleShowOnWeb: req.body.saleShowOnWeb
        }

        const rent = {
            rentValue: req.body.rentValue,
            rentShowOnWeb: req.body.rentShowOnWeb
        }


        const communityExpenses = {
            expensesValue: req.body.expensesValue,
            expensesShowOnWeb: req.body.expensesShowOnWeb
        }
        const ibi = {
            ibiValue: req.body.ibiValue,
            ibiShowOnWeb: req.body.ibiShowOnWeb
        }

        const quality = {
            bedrooms: req.body.bedrooms,
            bathrooms: req.body.bathrooms,
            parking: req.body.parking,
            indoorPool: req.body.indoorPool,
            outdoorPool: req.body.outdoorPool,
            jobPositions: req.body.jobPositions,
            subway: req.body.subway,
            bus: req.body.bus,
            others: {
                lift: req.body.lift,
                dumbwaiter: req.body.dumbwaiter,
                liftTruck: req.body.liftTruck,
                airConditioning: req.body.airConditioning,
                centralHeating: req.body.centralHeating,
                subfloorHeating: req.body.subfloorHeating,
                indoorAlarm: req.body.indoorAlarm,
                outdoorAlarm: req.body.outdoorAlarm,
                fullHoursSecurity: req.body.fullHoursSecurity,
                gunRack: req.body.gunRack,
                strongBox: req.body.strongBox,
                well: req.body.well,
                homeAutomation: req.body.homeAutomation,
                centralVacuum: req.body.centralVacuum,
                padelCourt: req.body.padelCourt,
                tennisCourt: req.body.tennisCourt,
                terrace: req.body.terrace,
                storage: req.body.storage,
                swimmingPool: req.body.swimmingPool,
                garage: req.body.garage,
                falseCeiling: req.body.falseCeiling,
                raisedFloor: req.body.raisedFloor,
                qualityBathrooms: req.body.qualityBathrooms,
                freeHeight: req.body.freeHeight,
                smokeOutlet: req.body.smokeOutlet,
                accesControl: req.body.accesControl,
            },
        }

        const description = {
            web: req.body.web,
            emailPDF: req.body.emailPDF,
            distribution: req.body.distribution,
        }

        const images = {
            main: "",
            blueprint: "",
            others: [],
        }

        const newAd = new Ad({
            title: req.body.title,
            adReference: req.body.adReference,
            adStatus: req.body.adStatus,
            showOnWeb: req.body.showOnWeb,
            featuredOnMain: req.body.featuredOnMain,
            adDirection: adDirection,
            adType: req.body.adType,
            gvOperationClose: req.body.gvOperationClose,
            owner: req.body.owner,
            consultant: req.body.consultant,
            adBuildingType: req.body.adBuildingType,
            zone: req.body.zone,
            department: req.body.department,
            webSubtitle: req.body.webSubtitle,
            buildSurface: req.body.buildSurface,
            plotSurface: req.body.plotSurface,
            floor: req.body.floor,
            disponibility: req.body.disponibility,
            surfacesBox: req.body.surfacesBox,
            sale,
            rent,
            monthlyRent: req.body.monthlyRent,
            expenses: req.body.expenses,
            expensesIncluded: req.body.expensesIncluded,
            communityExpenses,
            ibi,
            buildingYear: req.body.buildingYear,
            quality,
            description,
            images
        })

        const adCreated = await newAd.save();

        return res.status(200).json(adCreated);

    } catch (err) {
        return next(err);
    }
}

const adMainImageUpload = async (req, res, next) => {
    try {
        const { id } = req.params

        const ad = await Ad.findById(id);
        const fieldsToUpdate = ad

        fieldsToUpdate.images.main = req.file ? req.file.location : '';

        const updatedAd = await Ad.findByIdAndUpdate(id, fieldsToUpdate, { new: true })

        return res.status(200).json(updatedAd);

    } catch (err) {
        return next(err);
    }
}

const adBlueprintImageUpload = async (req, res, next) => {
    try {
        const { id } = req.params

        const ad = await Ad.findById(id);
        const fieldsToUpdate = ad

        fieldsToUpdate.images.blueprint = req.file ? req.file.location : '';

        const updatedAd = await Ad.findByIdAndUpdate(id, fieldsToUpdate, { new: true })

        return res.status(200).json(updatedAd);

    } catch (err) {
        return next(err);
    }
}

const adOthersImagesUpload = async (req, res, next) => {
    try {
        const { id } = req.params

        const ad = await Ad.findById(id);
        const fieldsToUpdate = ad

        const others = req.files ? req.files.map(file => file.location) : [];

        if (ad.images.others.length !== 0) {
            req.files.forEach((file) => {
                if (!fieldsToUpdate.images.others.includes(file.location)) {
                    fieldsToUpdate.images.others.push(file.location);
                }
            })
        } else {
            fieldsToUpdate.images.others = others
        }

        const updatedAd = await Ad.findByIdAndUpdate(id, fieldsToUpdate, { new: true })

        return res.status(200).json(updatedAd);

    } catch (err) {
        return next(err);
    }
}

const adMainImagesDelete = async (req, res, next) => {
    try {
        const { id } = req.params

        deleteImage(req.body.toDelete)
        const ad = await Ad.findById(id);
        const fieldsToUpdate = ad

        fieldsToUpdate.images.main = ""

        const updatedAd = await Ad.findByIdAndUpdate(id, fieldsToUpdate, { new: true })

        return res.status(200).json(updatedAd);

    } catch (err) {
        return next(err);
    }
}

const adBlueprintImagesDelete = async (req, res, next) => {
    try {
        const { id } = req.params

        deleteImage(req.body.toDelete)

        const ad = await Ad.findById(id);
        const fieldsToUpdate = ad

        fieldsToUpdate.images.blueprint = ""

        const updatedAd = await Ad.findByIdAndUpdate(id, fieldsToUpdate, { new: true })

        return res.status(200).json(updatedAd);

    } catch (err) {
        return next(err);
    }
}

const adOthersImagesDelete = async (req, res, next) => {
    try {
        const { id } = req.params

        deleteImage(req.body.toDelete)

        const ad = await Ad.findById(id);
        const fieldsToUpdate = ad

        fieldsToUpdate.images.others = fieldsToUpdate.images.others.filter((location) => {
            return req.body.toDelete !== location
        })

        const updatedAd = await Ad.findByIdAndUpdate(id, fieldsToUpdate, { new: true })

        return res.status(200).json(updatedAd);

    } catch (err) {
        return next(err);
    }
}

const adUpdate = async (req, res, next) => {
    try {
        const { id } = req.body;

        const fieldsToUpdate = {}

        fieldsToUpdate.title = req.body.title
        fieldsToUpdate.showOnWeb = req.body.showOnWeb
        fieldsToUpdate.adStatus = req.body.adStatus
        fieldsToUpdate.adReference = req.body.adReference
        fieldsToUpdate.featuredOnMain = req.body.featuredOnMain
        fieldsToUpdate.adType = req.body.adType
        fieldsToUpdate.gvOperationClose = req.body.gvOperationClose
        fieldsToUpdate.owner = req.body.owner
        fieldsToUpdate.consultant = req.body.consultant
        fieldsToUpdate.adBuildingType = req.body.adBuildingType
        fieldsToUpdate.zone = req.body.zone
        fieldsToUpdate.department = req.body.department
        fieldsToUpdate.webSubtitle = req.body.webSubtitle
        fieldsToUpdate.buildSurface = req.body.buildSurface
        fieldsToUpdate.plotSurface = req.body.plotSurface
        fieldsToUpdate.floor = req.body.floor
        fieldsToUpdate.disponibility = req.body.disponibility
        fieldsToUpdate.monthlyRent = req.body.monthlyRent
        fieldsToUpdate.expenses = req.body.expenses
        fieldsToUpdate.expensesIncluded = req.body.expensesIncluded
        fieldsToUpdate.buildingYear = req.body.buildingYear

        fieldsToUpdate.adDirection = {
            address: {
                street: req.body.street,
                directionNumber: req.body.directionNumber,
                directionFloor: req.body.directionFloor
            },
            postalCode: req.body.postalCode,
            city: req.body.city,
            country: req.body.country
        };

        fieldsToUpdate.surfacesBox = req.body.surfacesBox

        fieldsToUpdate.sale = {
            saleValue: req.body.saleValue,
            saleShowOnWeb: req.body.saleShowOnWeb
        }
        fieldsToUpdate.rent = {
            rentValue: req.body.rentValue,
            rentShowOnWeb: req.body.rentShowOnWeb
        }

        fieldsToUpdate.communityExpenses = {
            expensesValue: req.body.expensesValue,
            expensesShowOnWeb: req.body.expensesShowOnWeb
        }

        fieldsToUpdate.ibi = {
            ibiValue: req.body.ibiValue,
            ibiShowOnWeb: req.body.ibiShowOnWeb
        }

        fieldsToUpdate.quality = {
            bedrooms: req.body.bedrooms,
            bathrooms: req.body.bathrooms,
            parking: req.body.parking,
            indoorPool: req.body.indoorPool,
            outdoorPool: req.body.outdoorPool,
            jobPositions: req.body.jobPositions,
            subway: req.body.subway,
            bus: req.body.bus,
            others: {
                lift: req.body.lift,
                dumbwaiter: req.body.dumbwaiter,
                liftTruck: req.body.liftTruck,
                airConditioning: req.body.airConditioning,
                centralHeating: req.body.centralHeating,
                subfloorHeating: req.body.subfloorHeating,
                indoorAlarm: req.body.indoorAlarm,
                outdoorAlarm: req.body.outdoorAlarm,
                fullHoursSecurity: req.body.fullHoursSecurity,
                gunRack: req.body.gunRack,
                strongBox: req.body.strongBox,
                well: req.body.well,
                homeAutomation: req.body.homeAutomation,
                centralVacuum: req.body.centralVacuum,
                padelCourt: req.body.padelCourt,
                tennisCourt: req.body.tennisCourt,
                terrace: req.body.terrace,
                storage: req.body.storage,
                swimmingPool: req.body.swimmingPool,
                garage: req.body.garage,
                falseCeiling: req.body.falseCeiling,
                raisedFloor: req.body.raisedFloor,
                qualityBathrooms: req.body.qualityBathrooms,
                freeHeight: req.body.freeHeight,
                smokeOutlet: req.body.smokeOutlet,
                accessControl: req.body.accessControl,
            },
        }

        fieldsToUpdate.description = {
            web: req.body.web,
            emailPDF: req.body.emailPDF,
            distribution: req.body.distribution,
        }


        const updatedAd = await Ad.findByIdAndUpdate(id, fieldsToUpdate, { new: true })

        return res.status(200).json(updatedAd);

    } catch (err) {
        return next(err);
    }
}

const adDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        let response = "";

        const deleted = await Ad.findByIdAndDelete(id);
        if (deleted) response = "Anuncio borrado de la base de datos";
        else response = "No se ha podido encontrar este anuncio. ¿Estás seguro de que existe?";

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    adGetAll,
    adGetOne,
    adCreate,
    adUpdate,
    adMainImageUpload,
    adMainImagesDelete,
    adBlueprintImageUpload,
    adBlueprintImagesDelete,
    adOthersImagesUpload,
    adOthersImagesDelete,
    adDelete,
    adGetMatchedRequests
}