import { Client, GuildMember, MessageEmbed } from "discord.js";
import { Iresponse } from "../../interfaces";
import { defaultErr } from "../../middleware/modules";

module.exports = {
    name: "stop",
    aliases: ["fuckoff", "leave"],
    description: "Stops bot",
    example: "",
    group: "music",

    guildOnly: true,
    adminOnly: false,
    slash: false,

    throttling: {
        duration: 30,
        usages: 1,
    },

    async execute(author: GuildMember, _client: Client): Promise<Iresponse> {
        try {
            const vc = author.voice.channel;
            const connection = author.guild.voice?.connection;
            if (vc === null) return { type: "content", content: "Join a voicechannel first." };
            if (!connection) return { type: "content", content: "No music is playing." };
            connection.disconnect();

            const embed = new MessageEmbed()
                .setDescription(`**left**`)
                .setColor(5362138);

            return { type: "embed", content: embed };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};