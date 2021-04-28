import { Client, GuildMember, MessageEmbed } from "discord.js";
import { Iresponse } from "../../interfaces";
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
            "type": "user",
            "name": "member",
            "description": "which user's warning to remove.",
            "default": false,
            "required": true
        },
        {
            "type": "integer",
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

        let searchQuery = "SELECT * FROM Warnings WHERE UserID = ? AND GuildID = ? ORDER BY `Date` ASC LIMIT 1 OFFSET ?";
        let delquery = "DELETE FROM Warnings WHERE `Date` = ? AND GuildID = ?";

        try {
            let query = await conn.query(searchQuery, [member.id, member.guild.id, number - 1]);

            if (query[0] == undefined) {
                return { type: "content", content: "Out of bounds." }
            }

            await conn.query(delquery, [query[0].Date, member.guild.id]);

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