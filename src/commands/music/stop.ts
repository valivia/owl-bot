import { GuildMember, MessageEmbed } from "discord.js";
import { defaultErr } from "../../modules/modules";
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
            if (vc === null) return { content: "Join a voicechannel first." };
            const subscription = this.client.musicService.get(author.guild.id);
            if (!subscription) return { content: "Bot isnt playing" };
            subscription.stop();

            const embed = new MessageEmbed()
                .setDescription(`**left**`)
                .setColor(5362138);

            return { embeds: [embed] };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};