import { GuildMember } from "discord.js";
import { defaultErr } from "../../modules/modules";
import { Command, OwlClient } from "../../types/classes";
import { MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
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
        });
    }

    async run(author: GuildMember): Promise<MsgResponse> {
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
    }
};