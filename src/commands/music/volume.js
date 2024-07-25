const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');

/**
 * Handles the `volume` command, adjusting the volume of the music playback.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const volumeCommand = async (client, message) => {
  const player = new Player(client);
  const queue = player.getQueue(message.guild);

  if (!queue || !queue.isPlaying()) {
    await message.reply({ embeds: [createEmbed('error', 'Nothing is currently playing.')] });
    return;
  }

  const volumeArg = message.content.slice(constants.PREFIX.length + 8); // Remove the command and space

  if (!volumeArg) {
    await message.reply({ embeds: [createEmbed('error', 'Please provide a volume level (0-100).')] });
    return;
  }

  const volume = parseInt(volumeArg);

  if (isNaN(volume) || volume < 0 || volume > 100) {
    await message.reply({ embeds: [createEmbed('error', 'Invalid volume level. Please enter a number between 0 and 100.')] });
    return;
  }

  try {
    queue.setVolume(volume / 100); // Normalize volume to a range of 0-1
    await message.reply({ embeds: [createEmbed('success', `Volume set to ${volume}%`)] });
  } catch (error) {
    console.error('Error setting volume:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while setting the volume.')] });
  }
};

module.exports = { volumeCommand };