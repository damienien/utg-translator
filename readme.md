# UtG Translation Bot
Author : damienien

This is a Discord bot that translates messages using the DeepL API. The bot listens for specific emoji reactions on messages and translates the message content into the corresponding language.

## Features

- Translates messages when a user reacts with a specific flag emoji.
- Creates a thread for each message to post translations.
- Caches translations to avoid duplicate translations.
- Cleans up the cache when threads are archived.

## Prerequisites

- Node.js (version 14 or higher)
- A Discord bot token
- A DeepL API key

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```

3. Create a .env file by copying the .env-template :
   ```sh
   cp .env-template .env
   ```

4. Open the .env file and add your DeepL API key and Discord bot token:
   ```env
   DEEP_API_URL="YOUR DEEPL API KEY"
   DISCORD_TOKEN="YOUR DISCORD TOKEN"
   ```

## Usage

Start the bot:
```sh
npm start
```

The bot will log in to Discord and start listening for messages and reactions.

## How It Works

- The bot uses the `discord.js` library to interact with the Discord API.
- The 

deepl-node library is used to translate text using the DeepL API.
- When a user reacts to a message with a flag emoji, the bot translates the message content into the corresponding language and posts the translation in a thread.

## Supported Languages

The bot currently supports the following languages based on the flag emoji:

- 🇫🇷: French (FR)
- 🇺🇸: English (en-US)
- 🇩🇪: German (DE)
- 🇪🇸: Spanish (ES)

## License

This project is licensed under the MIT License.