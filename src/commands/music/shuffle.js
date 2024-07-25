const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');

/**
 * Handles the `shuffle` command, shuffling the music queue.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const shuffleCommand = async (client, message) => {
  const player = new Player(client);
  const queue = player.getQueue(message.guild);

  if (!queue || !queue.isPlaying()) {
    await message.reply({ embeds: [createEmbed('error', 'Nothing is currently playing.')] });
    return;
  }

  try {
    queue.shuffle();
    await message.reply({ embeds: [createEmbed('success', 'Queue shuffled successfully.')] });
  } catch (error) {
    console.error('Error shuffling queue:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while shuffling the queue.')] });
  }
};

module.exports = { shuffleCommand };