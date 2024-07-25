const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');

/**
 * Handles the `queue` command, displaying the current music queue to the user.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const queueCommand = async (client, message) => {
  const player = new Player(client);
  const queue = player.getQueue(message.guild);

  if (!queue || queue.tracks.length === 0) {
    await message.reply({ embeds: [createEmbed('error', 'There are no songs in the queue.')] });
    return;
  }

  const currentTrack = queue.current;
  const queueEmbed = createEmbed('info', 'Current Queue:')
    .setDescription(`**Now Playing:** ${currentTrack.title} - ${currentTrack.platform}`);

  // Add upcoming tracks to the embed
  for (let i = 0; i < queue.tracks.length && i < 5; i++) { // Show up to 5 upcoming tracks
    const track = queue.tracks[i];
    queueEmbed.addField(`${i + 1}. ${track.title}`, `${track.platform}`, true);
  }

  // Handle queues longer than 5 tracks
  if (queue.tracks.length > 5) {
    queueEmbed.addField('\u200B', `... and ${queue.tracks.length - 5} more tracks.`);
  }

  await message.reply({ embeds: [queueEmbed] });
};

module.exports = { queueCommand };