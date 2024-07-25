const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const { deletePlaylist, getGuildSettings } = require('../../database/database.js');

/**
 * Handles the `playlist clear` command, deleting a specified playlist.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const clearPlaylistCommand = async (client, message) => {
  const guildSettings = await getGuildSettings(message.guild.id);
  const args = message.content.slice(guildSettings.prefix.length + 12).trim().split(/ +/); // Remove the command and space

  if (!args.length) {
    await message.reply({ embeds: [createEmbed('error', 'Please provide a playlist name.')] });
    return;
  }

  const playlistName = args.join(' ');

  try {
    await deletePlaylist(message.guild.id, playlistName);
    await message.reply({ embeds: [createEmbed('success', `Playlist \\\"${playlistName}\\\" deleted successfully.`)] });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while deleting the playlist.')] });
  }
};

module.exports = { clearPlaylistCommand };