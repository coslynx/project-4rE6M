const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');

/**
 * Handles the `resume` command, resuming playback of a paused track.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const resumeCommand = async (client, message) => {
  const player = new Player(client);
  const queue = player.getQueue(message.guild);

  if (!queue || !queue.isPlaying()) {
    await message.reply({ embeds: [createEmbed('error', 'Nothing is currently playing or paused.')] });
    return;
  }

  try {
    queue.resume();
    await message.reply({ embeds: [createEmbed('success', 'Resumed playback.')] });
  } catch (error) {
    console.error('Error resuming playback:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while resuming playback.')] });
  }
};

module.exports = { resumeCommand };