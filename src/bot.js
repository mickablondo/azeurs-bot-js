import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prefix = '/';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// =====================
// Charger toutes les commandes
// =====================
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const { name, description, execute, aliases } = await import(`./commands/${file}`);
  client.commands.set(name, { name, description, execute, aliases });

  if (aliases && Array.isArray(aliases)) {
    for (const alias of aliases) {
      client.commands.set(alias, { name, description, execute, aliases });
    }
  }
}

// =====================
// Charger les événements
// =====================
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const { name, execute } = await import(`./events/${file}`);
    client.on(name, (...args) => execute(...args, client));
  }
}

// =====================
// Gestion des messages
// =====================
client.on('messageCreate', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (command) command.execute(message, args, client);
});

// =====================
// Ready event
// =====================
client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// =====================
// Login
// =====================
client.login(process.env.TOKEN);
