export const name = 'bonjour';
export const description = 'Dire bonjour au bot';

/**
 * Function executed when the command /bonjour is triggered
 * @param {import('discord.js').Message} message - The Discord message object
 */
export function execute(message) {
    message.reply(`Salut ${message.author.username}, ça va ?`);
}
