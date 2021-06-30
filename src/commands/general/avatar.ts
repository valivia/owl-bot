import { GuildMember, ImageURLOptions, MessageEmbed } from "discord.js";
import { argType, Iresponse } from "../../interfaces";
import { defaultErr } from "../../middleware/modules";

module.exports = {
    name: "avatar",
    aliases: ["pfp"],
    description: "View avatar",
    example: "",
    group: "general",

    guildOnly: true,
    adminOnly: false,
    slash: false,

    args: [
        {
            "type": argType.user,
            "name": "member",
            "description": "Who's avatar to get",
            "default": false,
            "required": false,
        },

    ],

    throttling: {
        duration: 60,
        usages: 2,
    },

    async execute(author: GuildMember, { member }: { member: GuildMember | undefined }): Promise<Iresponse> {
        try {
            const settings: ImageURLOptions = { dynamic: true, size: 4096 };
            const avatar = member?.user !== undefined ? member.user.avatarURL(settings) : author.user.avatarURL(settings);

            const embed = new MessageEmbed()
                .setImage(`${avatar}`)
                .setFooter(`${author.user.username} <@${author.id}>`, author.user.displayAvatarURL())
                .setTimestamp();

            return { type: "embed", content: embed };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};