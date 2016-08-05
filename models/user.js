const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  gender: String,
  address: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
