const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  tracks: [
    {
      title: String,
      url: String,
      platform: String,
      duration: Number
    }
  ]
});

module.exports = { PlaylistSchema };