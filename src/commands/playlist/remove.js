const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const { deleteTrackFromPlaylist, getGuildSettings } = require('../../database/database.js');

/**
 * Handles the `playlist remove` command, removing a specified track from a playlist.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const removePlaylistCommand = async (client, message) => {
  const guildSettings = await getGuildSettings(message.guild.id);
  const args = message.content.slice(guildSettings.prefix.length + 13).trim().split(/ +/); // Remove the command and space

  if (args.length < 2) {
    await message.reply({ embeds: [createEmbed('error', 'Please provide a playlist name and track number.')] });
    return;
  }

  const playlistName = args[0];
  const trackNumber = parseInt(args[1]);

  if (isNaN(trackNumber) || trackNumber <= 0) {
    await message.reply({ embeds: [createEmbed('error', 'Invalid track number.')] });
    return;
  }

  try {
    await deleteTrackFromPlaylist(message.guild.id, playlistName, trackNumber);
    await message.reply({ embeds: [createEmbed('success', `Track removed from playlist \\\"${playlistName}\\\".`)] });
  } catch (error) {
    console.error('Error removing track from playlist:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while removing the track from the playlist.')] });
  }
};

module.exports = { removePlaylistCommand };