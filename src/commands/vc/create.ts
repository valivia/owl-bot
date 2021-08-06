import { GuildMember, GuildCreateChannelOptions, VoiceChannel } from "discord.js";
import { defaultErr } from "../../modules/modules";
import { Command, OwlClient } from "../../types/classes";
import { argType, MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "create",
            aliases: [""],
            description: "creates a new priv room.",
            example: "create myPrivateRoom",
            group: "moderator",

            guildOnly: true,
            adminOnly: false,
            slash: true,

            args: [
                {
                    "type": argType.string,
                    "name": "channelName",
                    "description": "Name of the channel",
                    "default": false,
                    "required": true,
                },
            ],

            throttling: {
                duration: 30,
                usages: 3,
            },
        });
    }

    async run(author: GuildMember, { channelName }: { channelName: string }, client: OwlClient): Promise<MsgResponse> {
        const db = client.db;
        try {
            const options: GuildCreateChannelOptions = {
                type: "voice",
                permissionOverwrites: [{
                    id: author.guild.id,
                    allow: ["VIEW_CHANNEL"],
                    deny: ["CONNECT"],
                }],
            };

            // Make channel.
            const channel = await author.guild.channels.create(channelName, options) as VoiceChannel;

            if (channel === undefined) {
                return defaultErr;
            }

            // Add to db.
            await db.voiceChannels.create({ data: { ChannelID: channel.id, GuildID: author.guild.id } });

            // Send message
            return { type: "text", content: "Channel added to db" };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};
