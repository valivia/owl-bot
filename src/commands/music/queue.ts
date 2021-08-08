import { EmbedFieldData, GuildMember, MessageEmbed, Util } from "discord.js";
import { decode, defaultErr } from "../../modules/modules";
import { Command, OwlClient } from "../../types/classes";
import { MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "queue",
            aliases: ["q"],
            description: "shows queue",
            example: "",
            group: "music",

            guildOnly: true,
            adminOnly: false,
            slash: false,

            throttling: {
                duration: 30,
                usages: 2,
            },
        });
    }

    async run(author: GuildMember): Promise<MsgResponse> {
        try {
            const vc = author.voice.channel;
            if (vc === null) return { content: "Join a voicechannel first." };
            const subscription = this.client.musicService.get(author.guild.id);
            if (!subscription) return { content: "Nothing is playing" };
            if (subscription.queue.length < 1) return { content: "No songs queued" };
            const list: EmbedFieldData[] = [];
            let x = 0;
            for (const song of subscription.queue) {
                x++;
                list.push({ name: x.toString(), value: `[${Util.escapeMarkdown(decode(song.songInfo.title))}](${song.songInfo.link})` });
            }

            const embed = new MessageEmbed()
                .addFields(list)
                .setColor(5362138)
                .setTimestamp()
                .setFooter(`${author.user.tag} - <@!${author.id}>`);

            return { embeds: [embed] };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};