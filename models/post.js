const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author: String,
  likes: { type: Number, default: 0 },
  likes_by: [{ type: Object, default: {} }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  comments: [{ type: Object, default: {} }],
});
module.exports = mongoose.model("post", postSchema);
