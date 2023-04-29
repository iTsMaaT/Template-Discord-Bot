const prettyMilliseconds = require('pretty-ms');
//gives ping and uptime, or can give ping a precise number of times with a custom delay inbetween
module.exports = {
    name: "ping",
    description: "Gives ping and uptime, or can give ping a precise number of times with a custom delay inbetween",
    category: "utils",
    async execute(logger, client, message, args) {
        if (args.length == 0) {
            //All ping info, but a single time
            const guild = await client.guilds.fetch(message.guildId);
            const target = await guild.members.fetch(client.user.id);
            const sent = await message.channel.send({ content: 'Pinging...', fetchReply: true });

            sent.edit(`

My ping is \`${client.ws.ping}ms\`
Uptime : \`${prettyMilliseconds(client.uptime)}\`
Round trip latency : \`${sent.createdTimestamp - message.createdTimestamp}ms\`
Bot's age : <t:${parseInt(target.user.createdTimestamp / 1000)}:R>
            `);
        }
    }
}
