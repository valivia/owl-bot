import search, { YouTubeSearchOptions } from "youtube-search";
import { decode, defaultErr, getThumbnail } from "../../modules/modules";
import dotenv from "dotenv";
import { GuildMember, MessageEmbed, Util } from "discord.js";
import { Command, OwlClient } from "../../types/classes";
import { argType, MsgResponse } from "../../types/types";
import { DiscordGatewayAdapterCreator, entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import musicService, { Song } from "../../middleware/musicHandler";
dotenv.config();

const options: YouTubeSearchOptions = {
    maxResults: 1,
    key: process.env.API_KEY,
};

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "play",
            aliases: ["p"],
            description: "Plays or queues a song",
            example: "one point perspective",
            group: "music",

            guildOnly: true,
            adminOnly: false,
            slash: false,

            args: [
                {
                    "type": argType.string,
                    "name": "songName",
                    "description": "song to play",
                    "default": false,
                    "required": true,
                },
            ],

            throttling: {
                duration: 60,
                usages: 3,
            },
        });
    }

    async run(author: GuildMember, { songName }: { songName: string }, _client: OwlClient): Promise<MsgResponse> {
        try {
            const vc = author.voice.channel;
            const client = author.client as OwlClient;
            if (vc === null) { return { content: "Join a voicechannel first." }; }

            const searchResult = await (await search(songName, options)).results[0];
            let subscription = client.musicService.get(author.guild.id);
            if (!subscription) {
                subscription = new musicService(
                    joinVoiceChannel({
                        channelId: vc.id,
                        guildId: vc.guild.id,
                        adapterCreator: vc.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
                    }),
                );

                subscription.voiceConnection.on("error", console.warn);
                client.musicService.set(author.guild.id, subscription);
            }

            const song = new Song({
                songInfo: searchResult,
                onStart() {
                    console.log("Now playing!");
                },
                onFinish() {
                    console.log("finished");
                },
                onError(error) {
                    console.warn(error);
                },
            });

            try {
                await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
            } catch (e) {
                console.warn(e);
                return { content: "Failed to join vc" };
            }

            subscription.addToQueue(song);

            const embed = new MessageEmbed()
                .setThumbnail(getThumbnail(searchResult.thumbnails))
                .setTitle(subscription.queue.length < 1 ? `Now playing` : "Song queued")
                .setDescription(`[${Util.escapeMarkdown(decode(searchResult.title))}](${searchResult.link})`)
                .setColor(5362138)
                .setFooter(`${author.user.username} <@${author.id}>`, author.user.displayAvatarURL())
                .setTimestamp();

            return { embeds: [embed] };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};