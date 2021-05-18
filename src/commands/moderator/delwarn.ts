import { Client, GuildMember, MessageEmbed } from "discord.js";
import { argType, Iresponse } from "../../interfaces";
import { defaultErr } from "../../middleware/modules";

module.exports = {
    name: "delwarn",
    aliases: ["dwarn"],
    description: "Deletes a specific warn.",
    example: "@valivia 2",
    group: "moderator",

    guildOnly: true,
    adminOnly: false,
    slash: true,

    args: [
        {
            "type": argType.user,
            "name": "member",
            "description": "which user's warning to remove.",
            "default": false,
            "required": true
        },
        {
            "type": argType.integer,
            "name": "number",
            "description": "which warning.",
            "default": false,
            "required": true
        }
    ],

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(_author: GuildMember, { member, number }: { member: GuildMember, number: number }, client: Client): Promise<Iresponse> {
        let conn = client.conn;
        if (number < 1) { return { type: "content", content: "Invalid index" } }

        try {
            const query = await conn.warnings.findFirst({
                where: {
                    UserID: member.id,
                    GuildID: member.guild.id,
                },
                orderBy: { Date: "asc" },
                skip: number - 1
            });

            if (query === null) return { type: "content", content: "Out of bounds." }

            await conn.warnings.delete({ where: { id: query.id } })

            let embed = new MessageEmbed()
                .setAuthor(`${member.user.username}#${member.user.discriminator}'s warning was removed`)
                .setColor(5362138)


            return { type: "embed", content: embed }
        } catch (e) {
            console.error(e);

            return defaultErr;
        }
    },
};