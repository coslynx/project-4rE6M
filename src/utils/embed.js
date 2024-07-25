const { EmbedBuilder } = require('discord.js');
const { constants } = require('./constants.js');

/**
 * Creates a Discord embed message with the specified type and description.
 *
 * @param {string} type The type of the embed message ('success', 'error', 'info', etc.).
 * @param {string} description The description of the embed message.
 * @returns {EmbedBuilder} The created embed message.
 */
const createEmbed = (type, description) => {
  const embed = new EmbedBuilder()
    .setColor(constants.EMBED_COLOR)
    .setDescription(description);

  switch (type) {
    case 'success':
      embed.setTitle('Success!');
      break;
    case 'error':
      embed.setTitle('Error!');
      embed.setColor('#ff0000'); // Red color for error embeds
      break;
    case 'info':
      embed.setTitle('Information');
      break;
    // Add more embed types as needed
  }

  return embed;
};

module.exports = { createEmbed };