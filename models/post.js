const mongoose = require("mongoose");

//post schema
const postSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    description: String,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: { type: Number, default: 0 },
    likes_by: [
      { userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } },
    ],
  },
  { timestamps: true }
);

//exports Post model
module.exports = mongoose.model("Post", postSchema);
