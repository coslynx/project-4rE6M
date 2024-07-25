const { Client, VoiceState } = require('discord.js');
const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');

/**
 * Handles the `voiceStateUpdate` event, managing voice channel entry and exit for the bot.
 *
 * @param {Client} client The Discord client instance.
 * @param {VoiceState} oldState The old voice state of the user.
 * @param {VoiceState} newState The new voice state of the user.
 */
const voiceStateUpdate = async (client, oldState, newState) => {
  // Check if the user joined or left a voice channel
  if (oldState.channel !== newState.channel) {
    const player = new Player(client);
    const queue = player.getQueue(oldState.guild);

    // If the user joined a voice channel and the bot is in the same channel
    if (newState.channel && newState.member.id === client.user.id) {
      // Send an embed message indicating the bot's join
      await newState.channel.send({
        embeds: [createEmbed('success', `Joined voice channel: ${newState.channel.name}`)],
      });
      return;
    }

    // If the user left a voice channel and the bot was in the same channel
    if (oldState.channel && oldState.member.id === client.user.id) {
      // Check if there are any users left in the channel
      if (oldState.channel.members.size === 1) {
        // If there are no other users, leave the channel and clear the queue
        await oldState.channel.leave();
        queue.stop();

        // Send an embed message indicating the bot's leave
        await oldState.channel.send({
          embeds: [createEmbed('info', `Left voice channel: ${oldState.channel.name}`)],
        });
      }
    }
  }
};

module.exports = { voiceStateUpdate };