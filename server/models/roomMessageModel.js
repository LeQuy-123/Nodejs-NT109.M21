const mongoose = require("mongoose");

const RoomMessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String },
      images: [{ type: String }],
    },
    from: Object,
    to: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RoomMessages", RoomMessageSchema);
