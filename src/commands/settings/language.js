const { Client, EmbedBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const { getGuildSettings, updateGuildSettings } = require('../../database/database.js');

/**
 * Handles the `language` command, allowing users to set the bot's language for the server.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const languageCommand = async (client, message) => {
  const guild = message.guild;
  const guildSettings = await getGuildSettings(guild.id);
  const args = message.content.slice(constants.PREFIX.length + 9).trim().split(/ +/); // Remove the command and space

  if (!args.length) {
    await message.reply({ embeds: [createEmbed('error', 'Please provide a language code (e.g., `!language en` for English).')] });
    return;
  }

  const languageCode = args[0].toLowerCase();
  const supportedLanguages = ['en', 'fr', 'de', 'es']; // Add more languages as needed

  if (!supportedLanguages.includes(languageCode)) {
    await message.reply({ embeds: [createEmbed('error', `Invalid language code. Supported languages: ${supportedLanguages.join(', ')}`)] });
    return;
  }

  try {
    await updateGuildSettings(guild.id, { language: languageCode });
    await message.reply({ embeds: [createEmbed('success', `Server language set to ${languageCode}.`)] });
  } catch (error) {
    console.error('Error setting server language:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while setting the server language.')] });
  }
};

module.exports = { languageCommand };