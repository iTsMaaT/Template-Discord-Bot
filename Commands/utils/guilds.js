const USERID = require("../../UserIDs.js");
module.exports = {
    name: "guilds",
    category: "utils",
    description: "Makes a list of the guilds the bot is in",
    private: true,
    execute(logger, client, message, args) {
        if (message.author.id == OwnerID) {
            //Maps all guilds and their IDs
            let content = client.guilds.cache.map(guild => `${guild.name} (\`${guild.id}\`)`).join("\n");
            message.reply({ content, allowedMentions: { repliedUser: false } });
        }
    }
}