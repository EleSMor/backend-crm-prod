const express = require('express');
const { upload, deleteImage } = require('../middlewares/file.middleware');
const { isAuth, isAdmin } = require('../middlewares/auth.middleware');
const {
    adGetAll,
    adGetOne,
    adGetMatchedRequests,
    adCreate,
    adUpdate,
    adMainImageUpload,
    adMainImagesDelete,
    adBlueprintImageUpload,
    adBlueprintImagesDelete,
    adOthersImagesUpload,
    adOthersImagesDelete,
    adDelete,
} = require('../controllers/ad.controller');

const router = express.Router();

router.get('/', adGetAll);
router.get('/matching/:id', adGetMatchedRequests);
router.get('/:id', adGetOne);

router.post('/create', adCreate);
router.put('/edit', adUpdate);
router.put('/upload/main/:id', upload.single('main'), adMainImageUpload);
router.put('/delete/main/:id', adMainImagesDelete);
router.put('/upload/blueprint/:id', upload.single('blueprint'), adBlueprintImageUpload);
router.put('/delete/blueprint/:id', adBlueprintImagesDelete);
router.put('/upload/others/:id', upload.array('others'), adOthersImagesUpload);
router.put('/delete/others/:id', adOthersImagesDelete);
router.delete('/delete/:id', adDelete);

module.exports = router;