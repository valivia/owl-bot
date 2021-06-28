import { Client, GuildMember, MessageEmbed } from "discord.js";
import moment from "moment";
import { argType, Iresponse } from "../../interfaces";

module.exports = {
    name: "warnings",
    aliases: ["warns"],
    description: "shows a user's warnings",
    example: "@valivia",
    group: "moderator",

    guildOnly: true,
    adminOnly: false,
    slash: true,

    args: [
        {
            "type": argType.user,
            "name": "member",
            "description": "which user's warnings to display.",
            "default": false,
            "required": true,
        },
    ],

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(author: GuildMember, { member }: { member: GuildMember }, { conn }: Client): Promise<Iresponse> {
        try {
            // Get from DB.
            const warnings = await conn.warnings.findMany({ where: { UserID: member.id, GuildID: member.guild.id }, orderBy: { Created: "asc" } });

            // Vars.
            let x = 0;
            const warns = [];
            // Loop through warnings
            for (const warning of warnings) {
                x++;
                // Get time.
                const date = moment(Number(new Date(warning.Created))).fromNow();
                // Add warning to the list.
                warns.push({ name: `${x}`, value: `**mod:** <@!${warning.ModID}>\n **reason:** ${warning.Reason}\n **Date:** ${date}` });

            }
            // Make embed.
            const embed = new MessageEmbed()
                .setAuthor(`${member.user.tag} has ${warnings.length} warnings.`, member.user.avatarURL() as string)
                .setColor(5362138)
                .setTimestamp()
                .setFooter(`${author.user.tag} - <@!${author.id}>`);

            // Add warnings to embed or say there are none.
            warns.length !== 0 ? embed.addFields(warns) : embed.setDescription("This user has no warnings.");

            // Send embed.
            return { type: "embed", content: embed };
        } catch (e) {
            console.log(e);
            return { type: "text", content: "an error occured" };
        }
    },
};