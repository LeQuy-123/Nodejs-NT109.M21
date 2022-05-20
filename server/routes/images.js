const router = require("express").Router();
const { uploadMiddleware } = require("../middleware/upload");
const { getImage, uploadImage } = require("../controllers/imageController");



router.post("/uploadImage", uploadMiddleware, uploadImage);
router.get('/:id', getImage);

module.exports = router;
