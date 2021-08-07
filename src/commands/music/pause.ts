import { AudioPlayerStatus } from "@discordjs/voice";
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
            if (vc === null) return { content: "Join a voicechannel first." };
            const subscription = this.client.musicService.get(author.guild.id);
            if (!subscription) return { content: "Play a song first!" };
            const paused = subscription.player.state.status === AudioPlayerStatus.Paused;
            if (paused) subscription.player.unpause();
            else subscription.player.pause();

            return { content: `Song ${paused ? "resumed" : "paused"}` };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};