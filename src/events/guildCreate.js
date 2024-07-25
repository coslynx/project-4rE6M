const { Client, EmbedBuilder } = require('discord.js');
const { getGuildSettings, updateGuildSettings } = require('../../database/database.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');

/**
 * Handles the `guildCreate` event, setting up the bot's configuration for a newly joined server.
 *
 * @param {Guild} guild The guild object representing the newly joined server.
 */
const guildCreate = async (guild) => {
  try {
    // Check if the guild already has settings in the database
    const existingSettings = await getGuildSettings(guild.id);

    if (!existingSettings) {
      // If no settings exist, create default settings
      const defaultSettings = {
        prefix: constants.PREFIX,
        language: 'en' // Default to English
      };

      await updateGuildSettings(guild.id, defaultSettings);
      console.log(`[Guild Create]: Created default settings for guild ${guild.name} (${guild.id})`);
    } else {
      console.log(`[Guild Create]: Guild ${guild.name} (${guild.id}) already has settings.`);
    }

    // Send a welcome message to the server
    const welcomeEmbed = createEmbed('info', `Hello ${guild.name}!`)
      .setDescription('Thank you for inviting me to your server! I\'m ready to play music and manage playlists. To see what I can do, type `!help`.');

    guild.systemChannel.send({ embeds: [welcomeEmbed] }).catch(error => {
      console.error(`[Guild Create]: Error sending welcome message to guild ${guild.name} (${guild.id}):`, error);
    });

  } catch (error) {
    console.error(`[Guild Create]: Error setting up guild ${guild.name} (${guild.id}):`, error);
  }
};

module.exports = { guildCreate };