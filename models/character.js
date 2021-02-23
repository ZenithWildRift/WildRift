const mongoose = require('mongoose');

var characterSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  avatar: {
    type: String,
  },
  portrait: {
    type: String,
  },
  landscape: {
    type: String,
  },
  id: {
    type: String,
    unique: true,
  } 
});

module.exports = mongoose.model("Character", characterSchema);