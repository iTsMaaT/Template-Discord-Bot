const prettyMilliseconds = require('pretty-ms');
module.exports = {
    name: "shutdown",
    category: "utils",
    description: "Shutdowns the bot from discord",
    private: true,
    execute(logger, client, message, args) {
        if (message.author.id == OwnerID) {
            logger.severe("Shutdown requested from discord...").then(() => {
                //Destroys the client, disconnects the database and exits the process
                client.destroy();
                process.exit(0);
            })
        }
    }
}
