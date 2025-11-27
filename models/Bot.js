const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  persona: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    default: 'Anonymous'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Bot', botSchema);
