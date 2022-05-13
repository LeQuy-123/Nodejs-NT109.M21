const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  password: {
    type: String,
    min: 8,
  },
  host: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  user: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Rooms", roomSchema);
