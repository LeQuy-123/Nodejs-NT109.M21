const { addMessage, getMessages, getAllImageInChat, deleteMessage } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/getImages", getAllImageInChat);
router.delete("/deleteMsg/:id", deleteMessage);

module.exports = router;
