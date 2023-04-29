const { Client, Intents, GatewayIntentBits, EmbedBuilder, PermissionsBitField, SelectMenuOptionBuilder, Events, WebhookClient, Partials } = require("discord.js");
const Logger = require("./utils/log");
const SaveFile = require("./utils/save_file");
const dotenv = require("dotenv");
dotenv.config();
const Discord = require('discord.js');
const fs = require('fs');
const path = require('node:path');

const client = new Client({
    intents: Object.keys(GatewayIntentBits), // all intents
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

global.prefix = '>'; //Change it to the prefix you want to use as a base one
global.BaseActivityStatus = `${prefix}help` //Change it if you want another activity status when the bot starts
global.OwnerID = process.env.

// Add array.equals()
Array.prototype.equals = function (b) {
    return this.length == b.length && this.every((v, i) => v === b[i]);
}


//Logger system and databases
const logger = new Logger({ root: __dirname, client });
global.prefixData = new SaveFile({ root: __dirname, fileName: 'prefixes.json' });


//Error handler
process.on("uncaughtException", (err) => {
    logger.error(err.stack);

});

//create a collection for text commands
client.commands = new Discord.Collection();
//create a collection for slash commands
client.slashcommands = new Discord.Collection();

//Slash command finder
const slashcommandsPath = path.join(__dirname, 'slash');
const slashcommandFiles = fs.readdirSync(slashcommandsPath).filter(file => file.endsWith('.js'));


//Slash command handler
for (const file of slashcommandFiles) {
    const filePath = path.join(slashcommandsPath, file);
    const slashcommand = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in slashcommand && 'execute' in slashcommand) {
        client.slashcommands.set(slashcommand.data.name, slashcommand);
    } else {
        logger.warning(`The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

//Text command handler
const commandFiles = fs.readdirSync('./Commands/');
while (commandFiles.length > 0) {
    let file = commandFiles.shift();
    if (file.endsWith('.js')) {
        const command = require(`./Commands/${file}`);
        client.commands.set(command.name, command)
    } else {
        let newFiles = fs.readdirSync('./Commands/' + file);
        newFiles.forEach(f => commandFiles.push(file + '/' + f));
    }
}

//Bot setup on startup
client.on("ready", () => {

    logger.info("Bot starting...");

    client.user.setActivity(BaseActivityStatus);

    //Confirmation of a successful initialization
    setTimeout(function () {
        logger.info("Bot started successfully.");
    }, 1000 * 0.1);
});

//Member join and leave logging
client.on('guildMemberAdd', member => {
    logger.info(`${member.user.tag} (${member.id}) joined \`${member.guild.name}\``)
});
client.on('guildMemberRemove', member => {
    logger.info(`${member.user.tag} (${member.id}) left \`${member.guild.name}\``)
});

//Bot join and leave logging
client.on('guildCreate', guild => {
    logger.info(`The bot has been added to \`${guild.name}\``)
});
client.on('guildDelete', guild => {
    logger.info(`The bot has been removed from \`${guild.name}\``)
});

//Debug event
client.on('debug', debug => {
    console.log(debug);
});

//Guild unavailability (outage)
client.on('guildUnavailable', (guild) => {
    logger.severe(`A guild is unavailable, likely because of a server outage: ${guild}`);
});

//Restarting the bot when it becomes invalidated
client.on('invalidated', () => {
    logger.severe("The client was invalidated, restarting the bot...");
    setTimeout(function () {
        process.exit(1);
    }, 1000 * 3)
});

//Warning if rate-limited
client.on('rateLimit', (rateLimitData) => {
    logger.warning(`The bot is rate-limited: ${rateLimitData}`);
});

//Warning info
client.on('warn', (info) => {
    logger.warning(`Warning: ${info}`);
});

//Slash command executing
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const slash = interaction.client.slashcommands.get(interaction.commandName);

    if (!slash) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        //execute the slash command
        await slash.execute(logger, interaction, client);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
    }
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    //Text command executing
    let prefix = prefixData.getValue(message.guildId) ?? global.prefix;
    if (message.content.startsWith(prefix)) {

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        // If command does not exist, return
        if (!client.commands.get(command)) {
            return;
        }

        //Logging every executed commands

        logger.info(`Executing [${message.content}]\nby\t[${message.member.user.tag} (${message.author.id})]\nin\t[${message.channel.name} (${message.channel.id})]\nfrom  [${message.guild.name} (${message.guild.id})]`);
        client.commands.get(command).execute(logger, client, message, args);
    }

    //Gives the prefix if the bot is pinged
    if (message.content == `<@${client.user.id}>`) {
        message.reply(`**Prefix** : ${prefix}\n**Help command** : ${prefix}help`);
    }
})
