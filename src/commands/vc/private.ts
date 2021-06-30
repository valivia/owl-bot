import { GuildMember } from "discord.js";
import { defaultErr } from "../../middleware/modules";
import { Command, OwlClient } from "../../types/classes";
import { MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "private",
            aliases: [""],
            description: "toggles privacy",
            example: "",
            group: "vc",

            guildOnly: true,
            adminOnly: false,
            slash: false,

            throttling: {
                duration: 30,
                usages: 3,
            },
        });
    }

    async run(author: GuildMember, _: undefined, { conn }: OwlClient): Promise<MsgResponse> {
        try {
            // Make vc private/open
            const result = await conn.voiceChannels.updateMany({
                where: { AND: [{ GuildID: author.guild.id }, { UserID: author.id }] },
                data: { Open: false },
            }).catch(() => {
                return false;
            });

            if (typeof (result) === "boolean") {
                return { type: "text", content: "You dont have a private room." };
            }

            // Notify user.
            return { type: "text", content: `Your voicechannel is now ${result.Open == 1 ? "closed" : "open"}.` };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};
