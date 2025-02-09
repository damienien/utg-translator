import { Client, GatewayIntentBits, Partials } from 'discord.js';
import * as deepl from 'deepl-node';
import dotenv from 'dotenv';
import 'dotenv/config';

dotenv.config();

const deeplApiKey = process.env.DEEP_API_URL;
const translator = new deepl.Translator(deeplApiKey);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Reaction, Partials.User],
});

// Flags and corresponding DeepL language codes
const emojiToLang = {
  '🇫🇷': 'FR',
  '🇺🇸': 'en-US',
  '🇩🇪': 'DE',
  '🇪🇸': 'ES',
};

client.once('ready', () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
});

client.on('guildMemberAdd', (member) => {
  const roleName = 'Pending';
  const role = member.guild.roles.cache.find((r) => r.name === roleName);

  if (!role) {
    console.error(`Impossible de trouver le rôle ${roleName}`);
    return;
  };

  try {
    member.roles.add(role);
    console.log(`Rôle "${roleName}" ajouté à ${member.user.tag}.`);
  } catch (error) {
    console.error(`Erreur lors de l'ajout du rôle à ${member.user.tag}:`, error);
  }
});

// Object to track already sent translations
const translationsCache = new Map();

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;

  try {
    // If reaction or message is partial, fetch them
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    const { message, emoji } = reaction;
    const langCode = emojiToLang[emoji.name];
    if (!langCode) return; // Ignore reactions with unsupported emojis

    // Verify if the message is empty
    if (!message.content || message.content.trim() === '') {
      console.warn(`Message vide détecté pour l'ID : ${message.id}`);
      return;
    }

    // Verify if the message is in a thread
    let thread = message.hasThread ? message.thread : null;

    // If the message is not in a thread, create one
    if (!thread) {
      thread = await message.startThread({
        name: `Traductions pour le message de ${message.author.username}`,
        autoArchiveDuration: 60,
        invitable: false, 
      });

      // Add the original message to the thread
      translationsCache.set(message.id, new Set());
    }

    // Check if the message has already been translated
    const cachedTranslations = translationsCache.get(message.id) || new Set();

    // If the message has already been translated to the target language, ignore
    if (cachedTranslations.has(langCode)) {
      console.log(`La traduction en ${langCode} pour le message ${message.id} a déjà été effectuée.`);
      return;
    }

    const translation = await translateText(message.content, langCode);

    // Add the target language to the cache
    cachedTranslations.add(langCode);
    translationsCache.set(message.id, cachedTranslations);

    await thread.send({
      content: `<@${user.id}> a demandé une traduction en ${emoji.name} :\n\n${translation}`,
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la réaction :', error);
  }
});

client.on('threadUpdate', (oldThread, newThread) => {
    if (newThread.archived) {
      translationsCache.delete(newThread.parentId); // Clear cache for the message
      console.log(`Cache nettoyé pour le message ${newThread.parentId}`);
    }
  });  
  

// Function to translate text using DeepL :)
async function translateText(text, targetLang) {
  try {
    const result = await translator.translateText(text, null, targetLang);
    return result.text;
  } catch (error) {
    console.error('Erreur de traduction DeepL:', error);
    throw error;
  }
}

client.login(process.env.DISCORD_TOKEN);
