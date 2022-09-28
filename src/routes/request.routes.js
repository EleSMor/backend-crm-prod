const express = require('express');
const { isAuth, isAdmin } = require('../middlewares/auth.middleware');
const {
    requestsGetAll,
    requestGetOne,
    requestLastReference,
    requestGetAdsMatched,
    requestGetNewMatched,
    requestGetByContact,
    requestCreate,
    requestUpdate,
    requestDelete
} = require('../controllers/request.controller');

const router = express.Router();

router.get('/', requestsGetAll);
router.get('/lastReference', requestLastReference);
router.get('/matching/:id', requestGetAdsMatched);
router.get('/contact/:id', requestGetByContact);
router.get('/:id', requestGetOne);

router.post('/create', requestCreate);
router.post('/matching/new', requestGetNewMatched);
router.put('/edit', requestUpdate);

router.delete('/delete/:id', requestDelete);

module.exports = router;