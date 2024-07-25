const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const { getPlaylist, getGuildSettings } = require('../../database/database.js');

/**
 * Handles the `playlist play` command, playing a specified playlist.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const playPlaylistCommand = async (client, message) => {
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
      await message.reply({ embeds: [createEmbed('error', `Playlist \"${playlistName}\" not found.`)] });
      return;
    }

    const player = new Player(client);
    const queue = player.getQueue(message.guild);

    // Add all tracks from the playlist to the queue
    for (const track of playlist.tracks) {
      queue.add(track);
    }

    // Start playing if the queue isn't already playing
    if (!queue.isPlaying()) {
      player.play(message.guild);
    }

    await message.reply({ embeds: [createEmbed('success', `Playing playlist \"${playlistName}\"`)] });

  } catch (error) {
    console.error('Error playing playlist:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while playing the playlist.')] });
  }
};

module.exports = { playPlaylistCommand };