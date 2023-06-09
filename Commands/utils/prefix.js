module.exports = {
    name: "prefix",
    description: "Changes the prefix to do commands",
    category: "utils",
    execute(logger, client, message, args) {
        if (args.length == 1) {
            //set or deletes the prefix, if a custom one was already applied
            if(args[0] !== global.prefix){
                prefixData.setValue(message.guildId, args[0]);
            } else {
                prefixData.deleteKey(message.guildId);
            }
            message.reply({ content: `The new prefix is \`${args[0]}\` in \`${message.member.guild.name}\``, allowedMentions: { repliedUser: false } });
            logger.info(`Prefix changed to ${args[0]} in \`${message.member.guild.name}\``);
        }
        else if (args.length == 0) {
            //No prefix error message
            message.reply(`No prefix entered.`);
        }
        else {
            //Multiple prefix error message
            message.reply(`You cannot have multiple prefixes.`);
        }
    }
}
