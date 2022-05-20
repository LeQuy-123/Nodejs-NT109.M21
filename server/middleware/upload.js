const multer = require("multer");
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');

function checkFileType(file, cb) {
    // https://youtu.be/9Qzmri1WaaE?t=1515
    // define a regex that includes the file types we accept
    const filetypes = /jpeg|jpg|png|gif/;
    //check the file extention
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // more importantly, check the mimetype
    const mimetype = filetypes.test(file.mimetype);
    // if both are good then continue
    if (mimetype && extname) return cb(null, true);
    // otherwise, return error message
    cb('filetype');
}

const storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-quy-server-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "images",
            filename: `${Date.now()}-quy-server-${file.originalname}`,
        };
    },
});

const store = multer({
    storage,
    // limit the size to 20mb for any files coming in
    limits: { fileSize: 20000000 },
    // filer out invalid filetypes
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }});

module.exports.uploadMiddleware = (req, res, next) => {
    const upload = store.single('images');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send('File too large');
        } else if (err) {
            // check if our filetype error occurred
            if (err === 'filetype') return res.status(400).send('Image files only');
            // An unknown error occurred when uploading.
            return res.sendStatus(500);
        }
        // all good, proceed
        next();
    });
};

module.exports.uploadMultipeMiddleware = (req, res, next) => {
    const upload = store.array('images', 12);
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send('File too large');
        } else if (err) {
            // check if our filetype error occurred
            if (err === 'filetype') return res.status(400).send('Image files only');
            // An unknown error occurred when uploading.
            return res.sendStatus(500);
        }
        // all good, proceed
        next();
    });
};