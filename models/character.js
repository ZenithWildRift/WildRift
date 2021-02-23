const mongoose = require('mongoose');

var characterSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  avatar: {
    data: Buffer,
    contentType: String
  },
  portrait: {
    data: Buffer,
    contentType: String
  },
  landscape: {
    data: Buffer,
    contentType: String
  },
  id: {
    type: String,
    unique: true,
  } 
});

module.exports = mongoose.model("Character", characterSchema);