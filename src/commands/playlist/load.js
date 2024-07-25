const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const { getPlaylist, getGuildSettings } = require('../../database/database.js');

/**
 * Handles the `playlist load` command, loading a specified playlist to the music queue.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const loadPlaylistCommand = async (client, message) => {
  const guildSettings = await getGuildSettings(message.guild.id);
  const args = message.content.slice(guildSettings.prefix.length + 11).trim().split(/ +/); // Remove the command and space

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

    const player = new Player(client);
    const queue = player.getQueue(message.guild);

    // Add all tracks from the playlist to the queue
    for (const track of playlist.tracks) {
      queue.add(track);
    }

    await message.reply({ embeds: [createEmbed('success', `Loaded playlist "${playlistName}" to the queue.`)] });

  } catch (error) {
    console.error('Error loading playlist:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while loading the playlist.')] });
  }
};

module.exports = { loadPlaylistCommand };