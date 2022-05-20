const { addMessage, getMessages, uploadImage} = require("../controllers/messageController");
const router = require("express").Router();
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { uploadMiddleware } = require("../middleware/upload");

const connect = mongoose.createConnection(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
let gfs;
connect.once('open', () => {
    // initialize stream
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
        bucketName: "images"
    });
});



router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/uploadImage", uploadMiddleware, uploadImage);
// router.post("/uploadImages", uploadMiddleware, uploadImage);

router.get('/:id', ({ params: { id } }, res) => {
    // if no id return error
    if (!id || id === 'undefined') return res.status(400).send('no image id');
    // if there is an id string, cast it to mongoose's objectId type
    const _id = new ObjectId(id);
    console.log("🚀 ~ file: messages.js ~ line 80 ~ router.get ~ gfs", gfs)
    // // search for the image by id
    gfs.find().toArray().then(files => {
        console.log("🚀 ~ file: messages.js ~ line 79 ~ gfs.find ~ files", files)
        if (!files || files.length === 0)
            return res.status(400).send('no files exist');
        // if a file exists, send the data
        gfs.openDownloadStream(_id).pipe(res);
    }).catch((err) => {
        console.log("🚀 ~ file: messages.js ~ line 37 ~ gfs.find ~ err", err)
    });
});
module.exports = router;
