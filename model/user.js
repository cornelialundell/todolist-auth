const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 255,
    sparse:true
  },
  email: { type: String, required: true, unique: true, sparse:true },
  password: { type: String, sparse:true },
  role: String,
  token: String,
  tokenExpiration: Date,
  facebookId: String,
  typeoflogin: {type: String, sparse:true}
});



const User = mongoose.model("user", userSchema);

module.exports = User;