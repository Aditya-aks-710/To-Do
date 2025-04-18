
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // prevents duplicate usernames
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String, // this will store the path to the uploaded image
    default: null,
  }
});

module.exports = mongoose.model('User', userSchema);
