const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  // Add user-specific data fields here, for example:
  // username: String,
  // email: String,
  // playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }]
});

module.exports = { UserSchema };