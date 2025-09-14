export const name = 'quiestla';
export const description = 'Liste les membres en ligne (hors bots)';
export const aliases = ['qui_est_la', 'who_is_online', 'whoisonline'];

/**
 * @param {import('discord.js').Message} message
 */
export async function execute(message) {
    // Vérifier que la commande est utilisée dans un serveur
    if (!message.guild) {
        await message.reply("Cette commande doit être utilisée dans un serveur.");
        return;
    }

    // S'assurer que les membres sont bien chargés
    await message.guild.members.fetch(); // récupère tous les membres

    // Filtrer les membres non-bot et qui ne sont pas offline
    const onlineMembers = message.guild.members.cache.filter(
        m => !m.user.bot && m.presence && m.presence.status !== 'offline'
    );

    if (onlineMembers.size === 0) {
        await message.reply("Personne de connecté (hors bots).");
        return;
    }

    // Limiter l'affichage à 25 pour éviter que ce soit trop long
    const displayList = onlineMembers
        .map(m => m.displayName)
        .slice(0, 25)
        .join(', ');

    const more = onlineMembers.size > 25 ? ` et ${onlineMembers.size - 25} de plus...` : "";

    await message.reply(`En ligne : ${displayList}${more}`);
}
