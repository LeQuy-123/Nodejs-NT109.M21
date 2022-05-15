const mongoose = require("mongoose");

const RoomMessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    from: Object,
    to: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RoomMessages", RoomMessageSchema);
