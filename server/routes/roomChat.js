const {
  getAllRooms,
  findOrCreateRoom,
} = require("../controllers/roomController");

const router = require("express").Router();



router.get("/allrooms/:roomName", getAllRooms);
router.post("/createRoom", findOrCreateRoom);

module.exports = router;
