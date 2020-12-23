const mongoose = require("mongoose");

// user schema
const userSchema = new mongoose.Schema({
  name: String,
  messages: [{ type: Object, default: {} }],
});

//exports User model
module.exports = mongoose.model("User", userSchema);
