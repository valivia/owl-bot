import { Client, GuildMember } from "discord.js";
import { Iresponse } from "../../interfaces";
import { defaultErr } from "../../middleware/modules";
module.exports = {
    name: "private",
    aliases: [""],
    description: "toggles privacy",
    examples: [""],
    group: "vc",

    guildOnly: true,
    adminOnly: false,
    slash: false,

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(author: GuildMember, _: undefined, { conn }: Client): Promise<Iresponse> {
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
    },
};
