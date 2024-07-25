const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const { createPlaylist, getGuildSettings } = require('../../database/database.js');

/**
 * Handles the `playlist create` command, creating a new playlist for the server.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const createPlaylistCommand = async (client, message) => {
  const guildSettings = await getGuildSettings(message.guild.id);
  const args = message.content.slice(guildSettings.prefix.length + 13).trim().split(/ +/); // Remove the command and space

  if (!args.length) {
    await message.reply({ embeds: [createEmbed('error', 'Please provide a playlist name.')] });
    return;
  }

  const playlistName = args.join(' ');

  try {
    await createPlaylist(message.guild.id, playlistName);
    await message.reply({ embeds: [createEmbed('success', `Playlist \\\"${playlistName}\\\" created successfully.`)] });
  } catch (error) {
    console.error('Error creating playlist:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while creating the playlist.')] });
  }
};

module.exports = { createPlaylistCommand };