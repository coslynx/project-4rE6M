const { Client, EmbedBuilder } = require('discord.js');
const { version } = require('../../package.json');
const { constants } = require('../../utils/constants.js');

/**
 * Handles the `about` command, providing information about the bot.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const aboutCommand = async (client, message) => {
  const embed = new EmbedBuilder()
    .setColor(constants.EMBED_COLOR)
    .setTitle('About MusicBot')
    .setDescription('A Discord music bot for playing music and managing playlists.')
    .addFields(
      { name: 'Version', value: version, inline: true },
      { name: 'Developer', value: 'Your Name Here', inline: true },
      { name: 'GitHub', value: '[Link to GitHub Repository](https://github.com/your-username/discord-music-bot)', inline: true }
    )
    .setFooter({ text: 'MusicBot - Enjoy the Music!' });

  await message.reply({ embeds: [embed] });
};

module.exports = { aboutCommand };