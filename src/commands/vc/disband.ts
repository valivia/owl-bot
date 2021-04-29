import { Client, GuildMember } from "discord.js";
import { defaultErr } from "../../middleware/modules";
module.exports = {
    name: "disband",
    aliases: [""],
    description: "creates a new priv room.",
    examples: ["create myPrivateRoom"],
    group: "moderator",

    guildOnly: true,
    adminOnly: false,
    slash: true,

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(author: GuildMember, _: undefined, client: Client) {
        let conn = client.conn;
        try {
            let userChannel = await conn.query("SELECT * FROM `VoiceChannels` WHERE `UserID` = ? AND `GuildID` = ?", [author.id, author.guild.id])
            userChannel = userChannel[0];

            // Check if user has a vc.
            if (userChannel == undefined) {
                return { type: "content", content: "You dont have an active private voicechat" }
            }

            // delete vc from db.
            await conn.query("UPDATE `VoiceChannels` SET UserID = NULL, Date = NULL, Open = 1 WHERE `UserID` = ? AND `GuildID` = ?", [author.id, author.guild.id]);
            await conn.query("DELETE FROM VCMembers WHERE ChannelID = ?", userChannel.ChannelID)

            // Check if in vc.
            if (author.voice.channel !== null && author?.voice.channel.id == userChannel.ChannelID) {
                // kick from vc
                author?.voice.channel.members.each((member: { voice: { kick: () => void; }; }) => {
                    member.voice.kick();
                });
            }
            // Send message
            return { type: "content", content: "voice channel disbanded" };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};
