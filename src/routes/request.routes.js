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

router.get('/', isAuth, requestsGetAll);
router.get('/lastReference', isAuth, requestLastReference);
router.get('/matching/:id', isAuth, requestGetAdsMatched);
router.get('/contact/:id', isAuth, requestGetByContact);
router.get('/:id', isAuth, requestGetOne);

router.post('/create', isAuth, requestCreate);
router.post('/matching/new', isAuth, requestGetNewMatched);
router.put('/edit', isAuth, requestUpdate);

router.delete('/delete/:id', [isAuth, isAdmin], requestDelete);

module.exports = router;