const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');

/**
 * Handles the `nowplaying` command, displaying information about the currently playing track.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const nowPlayingCommand = async (client, message) => {
  const player = new Player(client);
  const queue = player.getQueue(message.guild);

  if (!queue || !queue.isPlaying()) {
    await message.reply({ embeds: [createEmbed('error', 'Nothing is currently playing.')] });
    return;
  }

  const currentTrack = queue.current;
  const embed = createEmbed('info', `Now Playing: ${currentTrack.title}`)
    .setDescription(`Platform: ${currentTrack.platform}`)
    .addField('Duration', `${Math.floor(currentTrack.duration / 60)}:${(currentTrack.duration % 60).toString().padStart(2, '0')}`);

  await message.reply({ embeds: [embed] });
};

module.exports = { nowPlayingCommand };