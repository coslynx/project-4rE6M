const mongoose = require('mongoose');
const { GuildSchema } = require('./models/guild.js');
const { UserSchema } = require('./models/user.js');
const { PlaylistSchema } = require('./models/playlist.js');

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if the connection fails
  }
};

const getGuildSettings = async (guildId) => {
  try {
    const guild = await mongoose.model('Guild', GuildSchema).findById(guildId);
    return guild ? guild.toObject() : null;
  } catch (error) {
    console.error('Error getting guild settings:', error);
    return null;
  }
};

const updateGuildSettings = async (guildId, settings) => {
  try {
    const guild = await mongoose.model('Guild', GuildSchema).findByIdAndUpdate(
      guildId,
      settings,
      { new: true }
    );
    return guild ? guild.toObject() : null;
  } catch (error) {
    console.error('Error updating guild settings:', error);
    return null;
  }
};

const createUser = async (userId, userData) => {
  try {
    const user = await mongoose.model('User', UserSchema).create({
      _id: userId,
      ...userData
    });
    return user ? user.toObject() : null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

const getUser = async (userId) => {
  try {
    const user = await mongoose.model('User', UserSchema).findById(userId);
    return user ? user.toObject() : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

const updateUser = async (userId, userData) => {
  try {
    const user = await mongoose.model('User', UserSchema).findByIdAndUpdate(
      userId,
      userData,
      { new: true }
    );
    return user ? user.toObject() : null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

const createPlaylist = async (guildId, playlistName) => {
  try {
    const playlist = await mongoose.model('Playlist', PlaylistSchema).create({
      guildId,
      name: playlistName,
      tracks: []
    });
    return playlist ? playlist.toObject() : null;
  } catch (error) {
    console.error('Error creating playlist:', error);
    return null;
  }
};

const getPlaylist = async (guildId, playlistName) => {
  try {
    const playlist = await mongoose.model('Playlist', PlaylistSchema).findOne({
      guildId,
      name: playlistName
    });
    return playlist ? playlist.toObject() : null;
  } catch (error) {
    console.error('Error getting playlist:', error);
    return null;
  }
};

const savePlaylist = async (guildId, playlistName, tracks) => {
  try {
    const playlist = await mongoose.model('Playlist', PlaylistSchema).findOneAndUpdate(
      { guildId, name: playlistName },
      { tracks },
      { new: true, upsert: true }
    );
    return playlist ? playlist.toObject() : null;
  } catch (error) {
    console.error('Error saving playlist:', error);
    return null;
  }
};

const deletePlaylist = async (guildId, playlistName) => {
  try {
    const playlist = await mongoose.model('Playlist', PlaylistSchema).findOneAndDelete({
      guildId,
      name: playlistName
    });
    return playlist ? playlist.toObject() : null;
  } catch (error) {
    console.error('Error deleting playlist:', error);
    return null;
  }
};

const addTrackToPlaylist = async (guildId, playlistName, track) => {
  try {
    const playlist = await mongoose.model('Playlist', PlaylistSchema).findOneAndUpdate(
      { guildId, name: playlistName },
      { $push: { tracks: track } },
      { new: true }
    );
    return playlist ? playlist.toObject() : null;
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    return null;
  }
};

const deleteTrackFromPlaylist = async (guildId, playlistName, trackNumber) => {
  try {
    const playlist = await mongoose.model('Playlist', PlaylistSchema).findOneAndUpdate(
      { guildId, name: playlistName },
      { $pull: { tracks: { $elemMatch: { trackIndex: trackNumber - 1 } } } },
      { new: true }
    );
    return playlist ? playlist.toObject() : null;
  } catch (error) {
    console.error('Error deleting track from playlist:', error);
    return null;
  }
};

module.exports = {
  connectToDatabase,
  getGuildSettings,
  updateGuildSettings,
  createUser,
  getUser,
  updateUser,
  createPlaylist,
  getPlaylist,
  savePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  deleteTrackFromPlaylist
};