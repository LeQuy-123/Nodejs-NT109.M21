const {
  getAllRooms,
  findOrCreateRoom,
  leaveRoom,
  getAllRoomMessages,
  addRoomMessage,
  getUsersInRoomAPI,
  getRoomHaveUser,
  deleteMsg,
  getAllRoomImage,
} = require("../controllers/roomController");

const router = require("express").Router();



router.get("/allrooms/:roomName", getAllRooms);
router.post("/createRoom", findOrCreateRoom);
router.post("/leaveRoom", leaveRoom);

router.post("/addmsg", addRoomMessage);
router.post("/getmsg", getAllRoomMessages);
router.post("/getAllUserInRoom", getUsersInRoomAPI);
router.post("/getAllRoomImages", getAllRoomImage);

router.post("/getRoomHaveUser", getRoomHaveUser);
router.delete("/deleteMsg/:id", deleteMsg);

module.exports = router;
