const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true, 
  },
  message: {
    type: String,
    required: true, 
    maxlength: 500, 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

const messages = mongoose.model('messages', messageSchema);

module.exports = messages;
