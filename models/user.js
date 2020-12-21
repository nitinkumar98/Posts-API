const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  messages: [{ type: Object, default: {} }],
});

module.exports = mongoose.model("User", userSchema);
