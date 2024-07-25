const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');

/**
 * Handles the `stop` command, stopping music playback and clearing the queue.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const stopCommand = async (client, message) => {
  const player = new Player(client);
  const queue = player.getQueue(message.guild);

  if (!queue || !queue.isPlaying()) {
    await message.reply({ embeds: [createEmbed('error', 'Nothing is currently playing.')] });
    return;
  }

  try {
    queue.stop();
    await message.reply({ embeds: [createEmbed('success', 'Stopped playback and cleared the queue.')] });
  } catch (error) {
    console.error('Error stopping playback:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while stopping playback.')] });
  }
};

module.exports = { stopCommand };