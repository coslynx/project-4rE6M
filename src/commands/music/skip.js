const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');

/**
 * Handles the `skip` command, skipping the currently playing track in the music queue.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const skipCommand = async (client, message) => {
  const player = new Player(client);
  const queue = player.getQueue(message.guild);

  if (!queue || !queue.isPlaying()) {
    await message.reply({ embeds: [createEmbed('error', 'Nothing is currently playing.')] });
    return;
  }

  try {
    const currentTrack = queue.current;
    queue.skip();
    await message.reply({ embeds: [createEmbed('success', `Skipped \`${currentTrack.title}\`. Now playing \`${queue.current.title}\`.`)] });
  } catch (error) {
    console.error('Error skipping track:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while skipping the track.')] });
  }
};

module.exports = { skipCommand };