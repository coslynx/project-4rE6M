const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const ytdl = require('ytdl-core');
const SpotifyAPI = require('spotify-web-api-node');
const SoundCloud = require('soundcloud-node');

/**
 * Handles the `add` command, adding a track to the music queue.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const addCommand = async (client, message) => {
  const searchQuery = message.content.slice(constants.PREFIX.length + 4); // Remove the command and space

  if (!searchQuery) {
    await message.reply({ embeds: [createEmbed('error', 'Please provide a search query')] });
    return;
  }

  const player = new Player(client);

  try {
    // Search for the track on YouTube
    let trackInfo = await searchYouTube(searchQuery);

    if (!trackInfo) {
      // Search for the track on Spotify
      trackInfo = await searchSpotify(searchQuery);

      if (!trackInfo) {
        // Search for the track on SoundCloud
        trackInfo = await searchSoundCloud(searchQuery);

        if (!trackInfo) {
          await message.reply({ embeds: [createEmbed('error', 'No results found for your search query')] });
          return;
        }
      }
    }

    // Add the track to the queue
    const queue = player.getQueue(message.guild);
    queue.add(trackInfo);

    // Send confirmation message
    await message.reply({
      embeds: [
        createEmbed('success', `Added "${trackInfo.title}" to the queue.`)
      ]
    });

  } catch (error) {
    console.error('Error adding track to queue:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while adding the track to the queue.')] });
  }
};

// Search functions for YouTube, Spotify, and SoundCloud

const searchYouTube = async (searchQuery) => {
  try {
    const info = await ytdl.getInfo(searchQuery);
    return {
      title: info.videoDetails.title,
      url: info.videoDetails.video_url,
      platform: 'youtube',
      duration: info.videoDetails.lengthSeconds
    };
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return null;
  }
};

const searchSpotify = async (searchQuery) => {
  const spotifyApi = new SpotifyAPI({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  });

  try {
    const data = await spotifyApi.search({
      q: searchQuery,
      type: 'track'
    });

    if (data.body.tracks.items.length > 0) {
      const track = data.body.tracks.items[0];
      return {
        title: track.name,
        url: track.external_urls.spotify,
        platform: 'spotify',
        duration: track.duration_ms / 1000
      };
    }

    return null;
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return null;
  }
};

const searchSoundCloud = async (searchQuery) => {
  const soundCloudApi = new SoundCloud({
    clientId: process.env.SOUNDCLOUD_CLIENT_ID,
    clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET
  });

  try {
    const data = await soundCloudApi.get('/tracks', {
      q: searchQuery
    });

    if (data.length > 0) {
      const track = data[0];
      return {
        title: track.title,
        url: track.permalink_url,
        platform: 'soundcloud',
        duration: track.duration / 1000
      };
    }

    return null;
  } catch (error) {
    console.error('Error searching SoundCloud:', error);
    return null;
  }
};

module.exports = { addCommand };