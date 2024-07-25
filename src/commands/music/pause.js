const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');

/**
 * Handles the `pause` command, pausing playback of the current track.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const pauseCommand = async (client, message) => {
  const player = new Player(client);
  const queue = player.getQueue(message.guild);

  if (!queue || !queue.isPlaying()) {
    await message.reply({ embeds: [createEmbed('error', 'Nothing is currently playing.')] });
    return;
  }

  try {
    queue.pause();
    await message.reply({ embeds: [createEmbed('success', 'Paused playback.')] });
  } catch (error) {
    console.error('Error pausing playback:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while pausing playback.')] });
  }
};

module.exports = { pauseCommand };