const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const { getPlaylist, getGuildSettings } = require('../../database/database.js');

/**
 * Handles the `playlist show` command, displaying the details of a specified playlist.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const showPlaylistCommand = async (client, message) => {
  const guildSettings = await getGuildSettings(message.guild.id);
  const args = message.content.slice(guildSettings.prefix.length + 12).trim().split(/ +/); // Remove the command and space

  if (!args.length) {
    await message.reply({ embeds: [createEmbed('error', 'Please provide a playlist name.')] });
    return;
  }

  const playlistName = args.join(' ');

  try {
    const playlist = await getPlaylist(message.guild.id, playlistName);

    if (!playlist) {
      await message.reply({ embeds: [createEmbed('error', `Playlist "${playlistName}" not found.`)] });
      return;
    }

    const embed = createEmbed('info', `Playlist: ${playlistName}`)
      .setDescription(playlist.tracks.map((track, index) => `${index + 1}. ${track.title} - ${track.platform}`).join('\n'));

    await message.reply({ embeds: [embed] });

  } catch (error) {
    console.error('Error showing playlist:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while showing the playlist.')] });
  }
};

module.exports = { showPlaylistCommand };