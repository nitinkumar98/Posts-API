const mongoose = require("mongoose");

// message schema
const messageSchema = new mongoose.Schema(
  {
    text: String,
    sendBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    receiveBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    roomId: String,
  },
  { timestamps: true }
);

// exports message schema
module.exports = mongoose.model("Message", messageSchema);
