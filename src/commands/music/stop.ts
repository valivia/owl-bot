import { GuildMember, MessageEmbed } from "discord.js";
import { defaultErr } from "../../middleware/modules";
import { Command, OwlClient } from "../../types/classes";
import { MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
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
        });
    }

    async run(author: GuildMember): Promise<MsgResponse> {
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
    }
};