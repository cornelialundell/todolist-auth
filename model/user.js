const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: String,
  token: String,
  tokenExpiration: Date,
  facebookId: String
});



const User = mongoose.model("user", userSchema);

module.exports = User;
