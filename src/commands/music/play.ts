import { Client, GuildMember, MessageEmbed, Util, VoiceConnection } from "discord.js";
import search, { YouTubeSearchOptions, YouTubeSearchResults } from "youtube-search";
import { argType, Iresponse } from "../../interfaces";
import { defaultErr } from "../../middleware/modules";
import ytdl from "ytdl-core";
import dotenv from "dotenv";
dotenv.config();

const options: YouTubeSearchOptions = {
    maxResults: 1,
    key: process.env.API_KEY,
};

module.exports = {
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
            "name": "song",
            "description": "song to play",
            "default": false,
            "required": true,
        },
    ],

    throttling: {
        duration: 60,
        usages: 3,
    },

    async execute(author: GuildMember, { song }: { song: string }, _client: Client): Promise<Iresponse> {
        try {
            const vc = author.voice.channel;
            if (song === undefined) { return { type: "content", content: "What song do you want to hear?" }; }
            if (vc === null) { return { type: "content", content: "Join a voicechannel first." }; }
            if (!author.guild.voice?.connection) { await vc?.join(); }

            const searchResult = await (await search(song, options)).results[0];

            const connection = author.guild.voice?.connection;
            if (!connection) return defaultErr;
            const stream = ytdl(searchResult.id, { filter: "audioonly", quality: "highestaudio" });
            const dispatcher = connection.play(stream);

            dispatcher.on("finish", async () => { songEnd(connection as VoiceConnection); });

            console.log(searchResult);

            const embed = new MessageEmbed()
                .setThumbnail(getThumbnail(searchResult.thumbnails))
                .setTitle(`Now playing`)
                .setDescription(`[${Util.escapeMarkdown(searchResult.title)}](${searchResult.link})`)
                .setColor(5362138)
                .setFooter(`${author.user.username} <@${author.id}>`, author.user.displayAvatarURL())
                .setTimestamp();

            return { type: "embed", content: embed };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};

async function songEnd(vc: VoiceConnection): Promise<void> {
    vc.disconnect();
}

function getThumbnail(thumbnails: YouTubeSearchResults["thumbnails"]): string {
    if (thumbnails.high) return thumbnails.high.url;
    if (thumbnails.medium) return thumbnails.medium.url;
    if (thumbnails.default) return thumbnails.default.url;
    return "a";
}