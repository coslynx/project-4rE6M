const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const { savePlaylist, getGuildSettings } = require('../../database/database.js');

/**
 * Handles the `playlist save` command, saving the current music queue as a playlist.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const savePlaylistCommand = async (client, message) => {
  const guildSettings = await getGuildSettings(message.guild.id);
  const args = message.content.slice(guildSettings.prefix.length + 11).trim().split(/ +/); // Remove the command and space

  if (!args.length) {
    await message.reply({ embeds: [createEmbed('error', 'Please provide a playlist name.')] });
    return;
  }

  const playlistName = args.join(' ');

  try {
    const player = new Player(client);
    const queue = player.getQueue(message.guild);

    if (!queue || queue.tracks.length === 0) {
      await message.reply({ embeds: [createEmbed('error', 'There are no songs in the queue to save.')] });
      return;
    }

    await savePlaylist(message.guild.id, playlistName, queue.tracks);
    await message.reply({ embeds: [createEmbed('success', `Playlist \"${playlistName}\" saved successfully.`)] });

  } catch (error) {
    console.error('Error saving playlist:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while saving the playlist.')] });
  }
};

module.exports = { savePlaylistCommand };