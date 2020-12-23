const mongoose = require("mongoose");

// comment schema
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

// exports Comment model
module.exports = mongoose.model("Comment", commentSchema);
