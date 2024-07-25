const { Client, Message } = require('discord.js');
const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const { getGuildSettings } = require('../../database/database.js');
const { parseCommand } = require('../../utils/commands.js');

/**
 * Handles the `messageCreate` event, parsing commands and triggering command execution.
 *
 * @param {Client} client The Discord client instance.
 * @param {Message} message The message object that triggered the event.
 */
const messageCreate = async (client, message) => {
  if (message.author.bot) return; // Ignore messages from bots

  const guildSettings = await getGuildSettings(message.guild.id);
  const prefix = guildSettings.prefix;

  if (!message.content.startsWith(prefix)) return; // Ignore messages that don't start with the prefix

  const { commandName, args } = parseCommand(message.content, prefix);
  const command = client.commands.get(commandName);

  if (!command) return; // Ignore messages that don't contain a registered command

  try {
    await command.execute(client, message, args);
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while executing this command.')] });
  }
};

module.exports = { messageCreate };