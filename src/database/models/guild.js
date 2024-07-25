const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: '!'
  },
  language: {
    type: String,
    default: 'en'
  }
  // Add more guild-specific settings here as needed
});

module.exports = { GuildSchema };