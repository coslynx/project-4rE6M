const { Client, InteractionType } = require('discord.js');
const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const { getGuildSettings } = require('../../database/database.js');

/**
 * Handles the `interactionCreate` event, responding to slash commands and other interactions.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Interaction} interaction The interaction object.
 */
const interactionCreate = async (client, interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    const commandName = interaction.commandName;
    const guildSettings = await getGuildSettings(interaction.guild.id);
    const prefix = guildSettings.prefix;

    const command = client.commands.get(commandName);

    if (!command) {
      await interaction.reply({ embeds: [createEmbed('error', 'Invalid command.')] });
      return;
    }

    try {
      await command.execute(client, interaction);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      await interaction.reply({ embeds: [createEmbed('error', 'An error occurred while executing this command.')] });
    }
  }
};

module.exports = { interactionCreate };