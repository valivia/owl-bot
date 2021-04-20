import { Message, VoiceChannel } from "discord.js";
import { Database } from "sqlite";
module.exports = {
    name: "create",

    aliases: [""],
    description: "create a private vc",
    examples: [""],
    group: "vc",
    guildOnly: true,
    required: true,

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(msg: Message, args: object[], db: Database) {
        let name = args.join(" ").toLowerCase();
        let options = {
            type: 'voice',
            permissionOverwrites: [{
                id: msg.guild.id,
                allow: ['VIEW_CHANNEL'],
                deny: ['CONNECT']
            }]
        }

        // Make channel.
        let channel = await msg.guild?.channels.create(name, options) as VoiceChannel;

        if (channel == undefined ) {
            return msg.reply("an error occurred.");
        }

        // Add to db.
        db.run("INSERT INTO `VoiceChannels` (ChannelID) VALUES(?)", [channel.id])

        // Send message
        return msg.reply("Channel added to database.");
    },
};
