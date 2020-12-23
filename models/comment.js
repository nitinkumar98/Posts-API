const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: String,
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    onPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
