import { Client, GuildMember, VoiceChannel } from "discord.js";
import { Iresponse } from "../../interfaces";
import { defaultErr } from "../../middleware/modules";

module.exports = {
    name: "create",
    aliases: [""],
    description: "creates a new priv room.",
    examples: ["create myPrivateRoom"],
    group: "moderator",

    guildOnly: true,
    adminOnly: false,
    slash: true,

    args: [
        {
            "type": "string",
            "name": "channelName",
            "description": "Name of the channel",
            "default": false,
            "required": true
        }
    ],

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(author: GuildMember, { channelName }: { channelName: string }, client: Client): Promise<Iresponse> {
        let conn = client.conn;
        try {
            let options = {
                type: 'voice',
                permissionOverwrites: [{
                    id: author.guild.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['CONNECT']
                }]
            }

            // Make channel.
            let channel = await author.guild.channels.create(channelName, options) as VoiceChannel;

            if (channel === undefined) {
                return defaultErr
            }

            // Add to db.
            await conn.query("INSERT INTO `VoiceChannels` (ChannelID) VALUES(?)", [channel.id])
                .catch(err => {
                    console.log(err)
                    return defaultErr
                })

            // Send message
            return { type: "text", content: "Channel added to db" };
        } catch (e) {
            console.log(e);
            return defaultErr
        }
    },
};
