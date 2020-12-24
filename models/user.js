const mongoose = require("mongoose");

// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
});

//exports User model
module.exports = mongoose.model("User", userSchema);
