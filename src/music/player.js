const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');

/**
 * Class representing the music player.
 */
class Player {
  constructor(client) {
    this.client = client;
    this.queues = new Map();
  }

  /**
   * Retrieves the music queue for a specific guild.
   * 
   * @param {Discord.Guild} guild The guild to get the queue for.
   * @returns {Queue} The music queue for the guild, or null if no queue exists.
   */
  getQueue(guild) {
    return this.queues.get(guild.id);
  }

  /**
   * Creates a new music queue for a specific guild.
   * 
   * @param {Discord.Guild} guild The guild to create the queue for.
   * @returns {Queue} The newly created music queue.
   */
  createQueue(guild) {
    const queue = new Queue(guild);
    this.queues.set(guild.id, queue);
    return queue;
  }

  /**
   * Starts playing music in a guild's voice channel.
   * 
   * @param {Discord.Guild} guild The guild to play music in.
   */
  async play(guild) {
    const queue = this.getQueue(guild);

    if (!queue) {
      return;
    }

    if (!queue.connection) {
      try {
        const member = guild.members.cache.get(this.client.user.id);
        if (!member) {
          throw new Error('Bot is not in a voice channel.');
        }

        const channel = member.voice.channel;
        if (!channel) {
          throw new Error('Bot is not in a voice channel.');
        }

        queue.connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator
        });

        // Wait for the connection to enter the READY state
        await entersState(queue.connection, VoiceConnectionStatus.Ready, 20000);
      } catch (error) {
        console.error('Error joining voice channel:', error);
        queue.stop();
        return;
      }
    }

    if (!queue.isPlaying()) {
      queue.play();
    }
  }

  /**
   * Stops the music playback and clears the queue for a specific guild.
   * 
   * @param {Discord.Guild} guild The guild to stop music in.
   */
  stop(guild) {
    const queue = this.getQueue(guild);

    if (queue) {
      queue.stop();
    }
  }
}

/**
 * Class representing the music queue.
 */
class Queue {
  constructor(guild) {
    this.guild = guild;
    this.tracks = [];
    this.current = null;
    this.connection = null;
    this.player = createAudioPlayer();
    this.repeatMode = 0; // 0: off, 1: track, 2: queue
    this.isPlaying = false;

    this.player.on(AudioPlayerStatus.Idle, () => {
      this.isPlaying = false;
      this.next();
    });

    this.player.on('error', (error) => {
      console.error('Error during playback:', error);
      this.stop();
    });
  }

  /**
   * Adds a track to the queue.
   * 
   * @param {object} track The track to add.
   * @param {string} track.title The title of the track.
   * @param {string} track.url The URL of the track.
   * @param {string} track.platform The platform of the track.
   */
  add(track) {
    this.tracks.push(track);
  }

  /**
   * Plays the next track in the queue.
   */
  next() {
    if (this.repeatMode === 1 && this.current) {
      this.play(this.current);
      return;
    }

    if (this.tracks.length === 0) {
      this.stop();
      return;
    }

    this.current = this.tracks.shift();
    this.play(this.current);
  }

  /**
   * Plays the current track.
   */
  play(track) {
    if (!track) {
      return;
    }

    this.isPlaying = true;
    const resource = createAudioResource(this.getStream(track.url), { inlineVolume: true });
    resource.volume.setVolume(0.5); // Set initial volume to 50%
    this.player.play(resource);
    this.connection.subscribe(this.player);

    // Send a message to the channel indicating that the music is playing
    const channel = this.guild.channels.cache.get(this.connection.joinConfig.channelId);
    channel.send({ embeds: [createEmbed('success', `Now playing: ${track.title} - ${track.platform}`)] });
  }

  /**
   * Skips the current track.
   */
  skip() {
    this.player.stop();
  }

  /**
   * Stops music playback and clears the queue.
   */
  stop() {
    this.isPlaying = false;
    this.tracks = [];
    this.current = null;
    this.player.stop();

    // Disconnect from the voice channel if connected
    if (this.connection) {
      this.connection.disconnect();
    }

    // Send a message to the channel indicating that the music has stopped
    const channel = this.guild.channels.cache.get(this.connection.joinConfig.channelId);
    channel.send({ embeds: [createEmbed('info', 'Playback stopped and queue cleared')] });
  }

  /**
   * Sets the volume of the music player.
   * 
   * @param {number} volume The volume to set (0-1).
   */
  setVolume(volume) {
    this.player.volume.setVolume(volume);
  }

  /**
   * Sets the repeat mode for the queue.
   * 
   * @param {number} repeatMode The repeat mode to set (0: off, 1: track, 2: queue).
   */
  setRepeatMode(repeatMode) {
    this.repeatMode = repeatMode;
  }

  /**
   * Shuffles the queue.
   */
  shuffle() {
    for (let i = this.tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
    }
  }

  /**
   * Gets the stream for a given URL.
   * 
   * @param {string} url The URL of the track.
   * @returns {ReadableStream} The stream for the track.
   */
  getStream(url) {
    if (url.startsWith('https://www.youtube.com/')) {
      return ytdl(url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 });
    } else if (url.startsWith('https://open.spotify.com/')) {
      // Implement Spotify stream logic
    } else if (url.startsWith('https://soundcloud.com/')) {
      // Implement SoundCloud stream logic
    }
  }
}

module.exports = { Player };