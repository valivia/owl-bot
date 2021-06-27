import { Logs_Event } from "@prisma/client";
import { Client, GuildMember, Message, VoiceChannel } from "discord.js";
import logHandler from "../../middleware/logHandler";
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
                return { type: "content", content: "You dont have a private room.", callBack: true };
            }

            let channel: VoiceChannel | null = author.voice.channel

            if (channel === null || channel.id !== result.ChannelID) {
                channel = await client.channels.fetch(result.ChannelID) as VoiceChannel;
            }

            channel.members.each((member: { voice: { kick: () => void; }; }) => { member.voice.kick(); });

            logHandler(Logs_Event.Room_Host, author.guild.id, author.user, channel.id);

            return { type: "content", content: "voice channel disbanded" };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};

export function callback(msg: Message) {
    console.log(msg.content);
}
