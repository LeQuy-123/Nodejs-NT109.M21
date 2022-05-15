const {
  getAllRooms,
  findOrCreateRoom,
  leaveRoom,
  getAllRoomMessages,
  addRoomMessage,
  getUsersInRoomAPI,
  getRoomHaveUser,
} = require("../controllers/roomController");

const router = require("express").Router();



router.get("/allrooms/:roomName", getAllRooms);
router.post("/createRoom", findOrCreateRoom);
router.post("/leaveRoom", leaveRoom);

router.post("/addmsg", addRoomMessage);
router.post("/getmsg", getAllRoomMessages);
router.post("/getAllUserInRoom", getUsersInRoomAPI);
router.post("/getRoomHaveUser", getRoomHaveUser);

module.exports = router;
