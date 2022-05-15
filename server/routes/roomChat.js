const {
  getAllRooms,
  findOrCreateRoom,
  leaveRoom,
  getAllRoomMessages,
  addRoomMessage,
  getUsersInRoomAPI,
} = require("../controllers/roomController");

const router = require("express").Router();



router.get("/allrooms/:roomName", getAllRooms);
router.post("/createRoom", findOrCreateRoom);
router.post("/leaveRoom", leaveRoom);

router.post("/addmsg", addRoomMessage);
router.post("/getmsg", getAllRoomMessages);
router.post("/getAllUserInRoom", getUsersInRoomAPI);

module.exports = router;
