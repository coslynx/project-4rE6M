const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const lyricsFinder = require('lyrics-finder');

/**
 * Handles the `lyrics` command, retrieving and displaying lyrics for the currently playing track.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const lyricsCommand = async (client, message) => {
  const player = new Player(client);
  const queue = player.getQueue(message.guild);

  if (!queue || !queue.isPlaying()) {
    await message.reply({ embeds: [createEmbed('error', 'Nothing is currently playing.')] });
    return;
  }

  const currentTrack = queue.current;

  try {
    const lyrics = await lyricsFinder(currentTrack.title, currentTrack.artist);

    if (lyrics) {
      const embed = createEmbed('info', `Lyrics for ${currentTrack.title} - ${currentTrack.artist}`)
        .setDescription(lyrics);
      await message.reply({ embeds: [embed] });
    } else {
      await message.reply({ embeds: [createEmbed('error', 'Could not find lyrics for this song.')] });
    }
  } catch (error) {
    console.error('Error retrieving lyrics:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while retrieving lyrics.')] });
  }
};

module.exports = { lyricsCommand };