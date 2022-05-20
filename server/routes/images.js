const router = require("express").Router();
const { uploadMiddleware, uploadMultipeMiddleware } = require("../middleware/upload");
const { getImage, uploadImage, deleteImage, uploadMultipeImage } = require("../controllers/imageController");



router.post("/uploadImage", uploadMiddleware, uploadImage);
router.post("/uploadImages", uploadMultipeMiddleware, uploadMultipeImage);

router.get('/:id', getImage);
router.delete('/:id', deleteImage);

module.exports = router;
