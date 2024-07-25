const { Player } = require('../../music/player.js');
const { createEmbed } = require('../../utils/embed.js');
const { constants } = require('../../utils/constants.js');
const ytdl = require('ytdl-core');
const SpotifyAPI = require('spotify-web-api-node');
const SoundCloud = require('soundcloud-node');
const ytsr = require('ytsr');

/**
 * Handles the `search` command, searching for music across YouTube, Spotify, and SoundCloud.
 *
 * @param {Client} client The Discord client instance.
 * @param {Discord.Message} message The message object that triggered the command.
 */
const searchCommand = async (client, message) => {
  const searchQuery = message.content.slice(constants.PREFIX.length + 7); // Remove the command and space

  if (!searchQuery) {
    await message.reply({ embeds: [createEmbed('error', 'Please provide a search query')] });
    return;
  }

  const player = new Player(client);

  try {
    // Search for the track on YouTube
    let searchResults = await searchYouTube(searchQuery);

    if (searchResults.length === 0) {
      // Search for the track on Spotify
      searchResults = await searchSpotify(searchQuery);

      if (searchResults.length === 0) {
        // Search for the track on SoundCloud
        searchResults = await searchSoundCloud(searchQuery);

        if (searchResults.length === 0) {
          await message.reply({ embeds: [createEmbed('error', 'No results found for your search query')] });
          return;
        }
      }
    }

    // Display search results to the user
    const embed = createEmbed('info', 'Search Results:')
      .setDescription(searchResults.map((result, index) => `${index + 1}. **${result.title}** - ${result.platform}`).join('\n'));

    await message.reply({ embeds: [embed] });

    // Ask the user to choose a track
    await message.channel.send('Please enter the number of the track you want to play.');

    const filter = m => !isNaN(m.content) && parseInt(m.content) > 0 && parseInt(m.content) <= searchResults.length;
    const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });

    if (collected.size === 0) {
      await message.reply({ embeds: [createEmbed('error', 'No response received. Please try again.')] });
      return;
    }

    const chosenTrackIndex = parseInt(collected.first().content) - 1;
    const chosenTrack = searchResults[chosenTrackIndex];

    // Add the chosen track to the queue and play if necessary
    const queue = player.getQueue(message.guild);
    queue.add(chosenTrack);

    if (!queue.isPlaying()) {
      player.play(message.guild);
    }

    await message.reply({ embeds: [createEmbed('success', `Added \"${chosenTrack.title}\" to the queue.`)] });

  } catch (error) {
    console.error('Error searching for music:', error);
    await message.reply({ embeds: [createEmbed('error', 'An error occurred while searching for music.')] });
  }
};

// Search functions for YouTube, Spotify, and SoundCloud

const searchYouTube = async (searchQuery) => {
  try {
    const searchResults = await ytsr(searchQuery, { limit: 5 });
    return searchResults.items.map(item => ({
      title: item.title,
      url: item.url,
      platform: 'youtube'
    }));
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return [];
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
      return data.body.tracks.items.map(track => ({
        title: track.name,
        url: track.external_urls.spotify,
        platform: 'spotify'
      }));
    }

    return [];
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return [];
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
      return data.map(track => ({
        title: track.title,
        url: track.permalink_url,
        platform: 'soundcloud'
      }));
    }

    return [];
  } catch (error) {
    console.error('Error searching SoundCloud:', error);
    return [];
  }
};

module.exports = { searchCommand };