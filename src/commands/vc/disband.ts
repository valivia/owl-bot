import { Client, GuildMember, VoiceChannel } from "discord.js";
import { defaultErr } from "../../middleware/modules";
module.exports = {
    name: "disband",
    aliases: [""],
    description: "Remove your private room.",
    examples: [""],
    group: "vc",

    guildOnly: true,
    adminOnly: false,
    slash: true,

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(author: GuildMember, _: undefined, client: Client) {
        let db = client.conn;
        try {
            let result = await db.voiceChannels.update({
                where: {
                    UserID: author.id
                },
                data: {
                    UserID: null,
                    Open: true,
                    VCMembers: {
                        deleteMany: {}
                    }
                }
            }).catch(() => {
                return false
            })

            if (typeof (result) === "boolean") {
                return { type: "content", content: "You dont have a private room." };
            }

            let channel: VoiceChannel | null = author.voice.channel

            if (channel === null || channel.id !== result.ChannelID) {
                channel = await client.channels.fetch(result.ChannelID) as VoiceChannel;
            }

            channel.members.each((member: { voice: { kick: () => void; }; }) => { member.voice.kick(); });

            return { type: "content", content: "voice channel disbanded" };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};
