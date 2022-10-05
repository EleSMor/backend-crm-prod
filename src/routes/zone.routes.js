const express = require('express');
const { isAuth, isAdmin } = require('../middlewares/auth.middleware');
const {
    zonesGetResidentials,
    zonesGetPatrimonials,
    zoneCreate,
    zoneDelete
} = require('../controllers/zone.controller');

const router = express.Router();

router.get('/residentials', zonesGetResidentials);
router.get('/patrimonials', zonesGetPatrimonials);

router.post('/create', zoneCreate);

router.delete('/delete/:id', zoneDelete);

module.exports = router;
