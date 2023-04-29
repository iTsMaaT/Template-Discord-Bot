const prettyMilliseconds = require('pretty-ms');
module.exports = {
    name: "restart",
    description: "Restart the bot from discord",
    category: "utils",
    private: true,
    execute(logger, client, message, args) {
        if (message.author.id == OwnerID) {
            logger.severe("Restart requested from discord...");
            message.reply("Restarting the bot.");
            client.channels.cache.get("1037141235451842701").send("Restart requested from discord...");

            //After 3s, closes the database and then exits the process
            setTimeout(function () {
                process.exit(1);
            }, 1000 * 3)
        }
    }
}