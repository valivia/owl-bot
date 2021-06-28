import { Client, GuildMember } from "discord.js";
import { Iresponse } from "../../interfaces";
import { defaultErr } from "../../middleware/modules";

module.exports = {
    name: "pause",
    aliases: [""],
    description: "Pauses current song",
    example: "",
    group: "music",

    guildOnly: true,
    adminOnly: false,
    slash: false,

    throttling: {
        duration: 30,
        usages: 2,
    },

    async execute(author: GuildMember, _client: Client): Promise<Iresponse> {
        try {
            const vc = author.voice.channel;
            const dispatcher = author.guild.voice?.connection?.dispatcher;
            if (vc === null) return { type: "content", content: "Join a voicechannel first." };
            if (!dispatcher) return { type: "content", content: "No music is playing." };
            if (dispatcher.paused) dispatcher.resume();
            else dispatcher.pause();

            return { type: "embed", content: `Song ${dispatcher.paused ? "paused" : "resumed"}` };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};