import { GuildMember } from "discord.js";
import { defaultErr } from "../../modules/modules";
import { Command, OwlClient } from "../../types/classes";
import { argType, MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "skip",
            aliases: [""],
            description: "skips song",
            example: "",
            group: "music",

            guildOnly: true,
            adminOnly: false,
            slash: false,

            args: [
                {
                    "type": argType.integer,
                    "name": "songIndex",
                    "description": "Which song",
                    "default": false,
                    "required": false,
                },
            ],

            throttling: {
                duration: 30,
                usages: 2,
            },
        });
    }

    async run(author: GuildMember, { songIndex }: { songIndex: number }, _client: OwlClient): Promise<MsgResponse> {
        try {
            const vc = author.voice.channel;
            if (vc === null) return { content: "Join a voicechannel first." };
            const subscription = this.client.musicService.get(author.guild.id);
            if (!subscription) return { content: "No music is playing" };

            if (!songIndex) subscription.player.stop();
            else subscription.queue.splice(songIndex - 1, 1);

            return { content: `Song skipped!` };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};