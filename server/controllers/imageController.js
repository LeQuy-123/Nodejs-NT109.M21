const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');


const connect = mongoose.createConnection(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
let gfs;
connect.once('open', () => {
  // initialize stream
  gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "images"
  });
});



module.exports.uploadImage = async (req, res, next) => {
  try {
    // get the .file property from req that was added by the upload middleware
    const { file } = req;
    // and the id of that new image file
    const { id } = file;
    // we can set other, smaller file size limits on routes that use the upload middleware
    // set this and the multer file size limit to whatever fits your project
    if (file.size > 5000000) {
      // if the file is too large, delete it and send an error
      deleteImage(id);
      return res.status(400).send('file may not exceed 5mb');
    }
    return res.send(file.id);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getImage = async (req, res, next) => {
  try {
    const id = req.params?.id;
    if (!id || id === 'undefined') return res.status(400).send('no image id');
    // if there is an id string, cast it to mongoose's objectId type
    const _id = new ObjectId(id);
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
  } catch (ex) {
    next(ex);
  }
};

