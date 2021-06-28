import { Client, GuildMember } from "discord.js";
import { argType, Iresponse } from "../../interfaces";
import { defaultErr } from "../../middleware/modules";

module.exports = {
    name: "volume",
    aliases: [""],
    description: "sets volume",
    example: "",
    group: "music",

    guildOnly: true,
    adminOnly: true,
    slash: false,

    args: [
        {
            "type": argType.string,
            "name": "volume",
            "description": "what volume",
            "default": false,
            "required": true,
        },
    ],

    throttling: {
        duration: 30,
        usages: 2,
    },

    async execute(author: GuildMember, { volume }: { volume: string }, _client: Client): Promise<Iresponse> {
        try {
            const vc = author.voice.channel;
            const dispatcher = author.guild.voice?.connection?.dispatcher;
            if (vc === null) return { type: "content", content: "Join a voicechannel first." };
            if (!dispatcher) return { type: "content", content: "No music is playing." };
            dispatcher.setVolume(parseFloat(volume));

            return { type: "embed", content: `Volume set to ${volume}` };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};