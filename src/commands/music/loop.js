const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');

/**
 * Handles the `loop` command, setting the loop mode for the music queue.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const loopCommand = async (client, message) => {
  const player = new Player(client);
  const queue = player.getQueue(message.guild);

  if (!queue || !queue.isPlaying()) {
    await message.reply({ embeds: [createEmbed('error', 'Nothing is currently playing.')] });
    return;
  }

  const loopMode = message.content.slice(constants.PREFIX.length + 6).toLowerCase(); // Remove the command and space

  if (!loopMode) {
    await message.reply({ embeds: [createEmbed('error', 'Please specify the loop mode: `track` or `queue`.')] });
    return;
  }

  if (loopMode === 'track') {
    queue.setRepeatMode(queue.repeatMode === 1 ? 0 : 1); // Toggle track repeat
    await message.reply({ embeds: [createEmbed('success', `Track loop mode set to ${queue.repeatMode === 1 ? 'on' : 'off'}.`)] });
  } else if (loopMode === 'queue') {
    queue.setRepeatMode(queue.repeatMode === 2 ? 0 : 2); // Toggle queue repeat
    await message.reply({ embeds: [createEmbed('success', `Queue loop mode set to ${queue.repeatMode === 2 ? 'on' : 'off'}.`)] });
  } else {
    await message.reply({ embeds: [createEmbed('error', 'Invalid loop mode. Please use `track` or `queue`.')] });
  }
};

module.exports = { loopCommand };