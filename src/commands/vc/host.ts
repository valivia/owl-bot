import { Logs_Event } from "@prisma/client";
import { Client, GuildMember, MessageEmbed } from "discord.js";
import logHandler from "../../middleware/logHandler";
import { defaultErr } from "../../middleware/modules";

module.exports = {
    name: "host",
    aliases: [""],
    description: "Host a private room",
    examples: [""],
    group: "vc",

    guildOnly: true,
    adminOnly: false,
    slash: true,

    throttling: {
        duration: 60,
        usages: 1,
    },


    async execute(author: GuildMember, _: undefined, client: Client) {
        const conn = client.conn;
        try {
            // Check if in vc.
            if (author.voice.channel == null) {
                return { type: "content", content: "Please join a voice channel first." };
            }

            // Query db for user's active vcs.
            const channel = await conn.voiceChannels.findFirst({
                where: {
                    OR: [
                        { UserID: author.id, GuildID: author.guild.id },
                        { UserID: null, GuildID: author.guild.id },
                    ],
                },
            });

            if (!channel) {
                return { type: "content", content: "There are no more private rooms available." };
            }

            if (channel.UserID) {
                // Move user into vc.
                author.voice.setChannel(channel.ChannelID);
                // Send message.
                return { type: "content", content: "moved back into your vc" };
            }

            await conn.voiceChannels.update({
                where: {
                    ChannelID: channel.ChannelID,
                },
                data: {
                    UserID: author.id,
                    VCMembers: {
                        create: {
                            UserID: author.id,
                        },
                    },
                },

            });

            // Move user into private vc.
            author.voice.setChannel(channel.ChannelID);

            // Log
            logHandler(Logs_Event.Room_Host, author.guild.id, author.user, channel.ChannelID);

            // Make embed
            const embed = new MessageEmbed()
                .addField("Success", (`Successfully assigned a voice channel`))
                .setColor("#559b0f")
                .setTimestamp();

            // Send message.
            return { type: "embed", content: embed };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};
