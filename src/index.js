const { Client, IntentsBitField } = require('discord.js');
const { token } = require('./config/config.js');
const { connectToDatabase } = require('./database/database.js');
const { logger } = require('./utils/logger.js');
const { Player } = require('./music/player.js');
const { registerCommands } = require('./utils/commands.js');
const { registerEvents } = require('./utils/events.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent
  ]
});

const player = new Player(client);

client.on('ready', async () => {
  logger.info(`Bot is ready as ${client.user.tag}`);

  try {
    await connectToDatabase();
    logger.info('Database connected successfully!');
  } catch (error) {
    logger.error('Error connecting to database:', error);
  }

  await registerCommands(client);
  logger.info('Commands registered successfully!');

  await registerEvents(client, player);
  logger.info('Events registered successfully!');
});

client.login(token).catch(error => logger.fatal('Failed to login:', error));