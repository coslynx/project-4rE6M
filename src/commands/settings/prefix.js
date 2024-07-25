const { Client, EmbedBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const { getGuildSettings, updateGuildSettings } = require('../../database/database.js');

/**
 * Handles the `prefix` command, allowing users to set a custom prefix for the bot on the server.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const prefixCommand = async (client, message) => {
  const guild = message.guild;
  const guildSettings = await getGuildSettings(guild.id);
  const args = message.content.slice(constants.PREFIX.length + 7).trim().split(/ +/); // Remove the command and space

  if (!args.length) {
    await message.reply({ embeds: [createEmbed('error', 'Please provide a new prefix (e.g., `!prefix ?` to set the prefix to `?`).')] });
    return;
  }

  const newPrefix = args[0];

  if (newPrefix.length > 5) {
    await message.reply({ embeds: [createEmbed('error', 'Prefix must be 5 characters or less.')] });
    return;
  }

  try {
    await updateGuildSettings(guild.id, { prefix: newPrefix });
    await message.reply({ embeds: [createEmbed('success', `Server prefix set to \`${newPrefix}\`.`)] });
  } catch (error) {
    console.error('Error setting server prefix:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while setting the server prefix.')] });
  }
};

module.exports = { prefixCommand };