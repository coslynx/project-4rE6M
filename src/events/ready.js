const { Client } = require('discord.js');
const { logger } = require('../../utils/logger.js');
const { registerCommands } = require('../../utils/commands.js');
const { registerEvents } = require('../../utils/events.js');
const { connectToDatabase } = require('../../database/database.js');

/**
 * Handles the `ready` event, indicating the bot is ready to connect to Discord and execute commands.
 *
 * @param {Client} client The Discord client instance.
 */
const ready = async (client) => {
  logger.info(`Bot is ready as ${client.user.tag}`);

  try {
    await connectToDatabase();
    logger.info('Database connected successfully!');
  } catch (error) {
    logger.error('Error connecting to database:', error);
  }

  await registerCommands(client);
  logger.info('Commands registered successfully!');

  await registerEvents(client);
  logger.info('Events registered successfully!');
};

module.exports = { ready };