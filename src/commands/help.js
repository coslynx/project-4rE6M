const { Client, EmbedBuilder } = require('discord.js');
const { constants } = require('../../utils/constants.js');

/**
 * Handles the `help` command, providing a list of available commands.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const helpCommand = async (client, message) => {
  const embed = new EmbedBuilder()
    .setColor(constants.EMBED_COLOR)
    .setTitle('MusicBot Help')
    .setDescription('Here are the available commands:')
    .addFields(
      { name: 'Music Playback', value: '`!play`, `!skip`, `!stop`, `!queue`, `!pause`, `!resume`, `!volume`, `!loop`, `!lyrics`, `!nowplaying`' },
      { name: 'Playlist Management', value: '`!playlist create`, `!playlist add`, `!playlist remove`, `!playlist clear`, `!playlist save`, `!playlist load`, `!playlist play`, `!playlist show`' },
      { name: 'Settings', value: '`!prefix`, `!language`' },
      { name: 'General', value: '`!help`, `!about`' }
    )
    .setFooter({ text: 'MusicBot - Enjoy the Music!' });

  await message.reply({ embeds: [embed] });
};

module.exports = { helpCommand };