# Discord Music Bot

This repository contains the source code for a Discord music bot, designed to provide a seamless and engaging music experience within Discord servers.

## Features

- **Cross-Platform Music Search:** Search for music from YouTube, Spotify, and SoundCloud.
- **Multi-Format Audio Support:** Play music in various formats like MP3, WAV, and OGG.
- **High-Quality Audio Playback:** Utilize FFmpeg and libopus for high-quality audio output.
- **Playback Controls:** Play, pause, skip, stop, queue, volume, shuffle, and loop music.
- **Voice Channel Integration:** Seamlessly join and leave voice channels based on user commands or presence.
- **Remote Control:** Control music playback from any channel within the server.
- **User Interface:** Interact with the bot through simple and understandable commands.
- **Playlist Management:** Create, save, share, and collaboratively edit playlists.
- **Customization:** Adjust bot settings, custom prefixes, and create custom commands.
- **Moderation Tools:** Control playback permissions and manage user roles.
- **Integrations:** Integrate with third-party platforms like Twitch and personal music libraries.

## Tech Stack

- **Programming Language:** JavaScript (Node.js)
- **Framework:** Discord.js
- **Database:** MongoDB
- **Packages:**
    - Discord.js: For Discord bot development.
    - ytdl-core: For downloading and streaming YouTube videos.
    - node-fetch: For making API requests.
    - dotenv: For loading environment variables.
    - ytsr: For searching and getting YouTube video information.
    - spotify-web-api-node: For accessing Spotify API.
    - soundcloud-api: For accessing SoundCloud API.
    - genius-lyrics-api: For fetching lyrics from Genius.
    - lyrics-finder: For searching and retrieving lyrics.
    - promise-retry: For retrying failed operations.
    - moment: For date and time formatting.
    - chalk: For colored console output.
    - nodemon: For automatically restarting the bot.
    - express: For creating a simple web server.
    - morgan: For logging HTTP requests.
    - helmet: For security headers.
    - cors: For enabling Cross-Origin Resource Sharing (CORS).
- **APIs:**
    - Discord API: For interacting with Discord.
    - YouTube Data API v3: For searching and retrieving YouTube videos.
    - Spotify API: For accessing Spotify playlists and tracks.
    - SoundCloud API: For accessing SoundCloud tracks and playlists.
    - Genius API: For retrieving lyrics.
- **Deployment:**
    - Docker: For containerization.
    - GitHub Actions: For continuous integration and deployment.
    - Heroku: Cloud platform for hosting.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/discord-music-bot.git
   ```

2. **Install dependencies:**
   ```bash
   cd discord-music-bot
   npm install
   ```

3. **Create a `.env` file:**
   ```bash
   cp .env.example .env
   ```
   Replace the placeholder values in the `.env` file with your own API keys and configuration settings.

4. **Run the bot:**
   ```bash
   npm start
   ```

## Usage

To use the bot, you can use the following commands:

- **!play [search query]:** Play a song or playlist from YouTube, Spotify, or SoundCloud.
- **!skip:** Skip the current track.
- **!stop:** Stop the music and clear the queue.
- **!queue:** View the current music queue.
- **!pause:** Pause the current track.
- **!resume:** Resume playback of the paused track.
- **!volume [number]:** Adjust the volume of the music.
- **!loop [track/queue]:** Loop the current track or the entire queue.
- **!lyrics:** Display the lyrics of the currently playing song.
- **!playlist [create/add/remove/clear/save/load/play/show]:** Manage playlists.
- **!prefix [new prefix]:** Change the bot's command prefix.
- **!help:** View a list of available commands.
- **!about:** Get information about the bot.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.