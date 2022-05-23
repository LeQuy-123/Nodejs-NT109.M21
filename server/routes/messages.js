const { addMessage, getMessages, getAllImageInChat } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/getImages", getAllImageInChat);

module.exports = router;
