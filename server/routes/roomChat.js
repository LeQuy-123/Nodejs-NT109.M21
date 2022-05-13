const {
  getAllRooms,
  findOrCreateRoom,
  leaveRoom,
} = require("../controllers/roomController");

const router = require("express").Router();



router.get("/allrooms/:roomName", getAllRooms);
router.post("/createRoom", findOrCreateRoom);
router.post("/leaveRoom", leaveRoom);

module.exports = router;
