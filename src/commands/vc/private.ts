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
    async execute(author: GuildMember, _: undefined, client: Client): Promise<Iresponse> {
        let conn = client.conn;
        try {
            let userChannel = await conn.query("SELECT * FROM VoiceChannels WHERE UserID = ? AND `GuildID` = ?", [author.id, author.guild.id]);
            userChannel = userChannel[0];
            // Check if user has a vc.
            if (userChannel == undefined) {
                return { type: "text", content: "You dont have an active private voicechat" };
            }

            // Make vc private/open
            await conn.query("UPDATE `VoiceChannels` SET Open = ? WHERE `UserID` = ? AND `GuildID` = ?", [userChannel.Open == 1 ? 0 : 1, author.id, author.guild.id]);

            // Notify user.
            return { type: "text", content: `Your voicechannel is now ${userChannel.Open == 1 ? "closed" : "open"}.` };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};
