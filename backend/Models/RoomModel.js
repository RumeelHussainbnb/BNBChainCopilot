// roomModel.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomName: String,
  userID: String,
});

module.exports = mongoose.model('Rooms', roomSchema);
