import { Client, GuildMember, MessageEmbed } from "discord.js";
import { argType, Iresponse, logType } from "../../interfaces";
import logHandler from "../../middleware/logHandler";

module.exports = {
    name: "warn",
    aliases: [""],
    description: "warns a user",
    example: "@valivia memes in general",
    group: "moderator",

    guildOnly: true,
    adminOnly: false,
    slash: true,

    args: [
        {
            "type": argType.user,
            "name": "member",
            "description": "User to warn",
            "default": false,
            "required": true
        },
        {
            "type": argType.string,
            "name": "reason",
            "description": "Reason why the user is getting warned",
            "default": false,
            "required": false
        }
    ],

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(author: GuildMember, { member, reason }: { member: GuildMember, reason: string }, { conn }: Client): Promise<Iresponse> {
        if (reason === undefined) { reason = "No reason provided" }
        try {
            // insert into db.
            await conn.warnings.create({ data: { UserID: member.id, Reason: reason.substr(0, 256), Date: Date.now(), GuildID: member.guild?.id, ModID: author.id } })
                .catch(e => {
                    console.log(e);
                    return { type: "text", content: "an error occured" };
                });

            const warnCount = await conn.warnings.count({ where: { UserID: member.id, GuildID: member.guild.id } })
            // make embed.
            let embed = new MessageEmbed()
                .setAuthor(`${member.user.username}#${member.user.discriminator} has been warned, ${warnCount} total`)
                .setDescription(`**reason:** ${reason}`)
                .setColor(5362138);

            logHandler("Warned", `warned for ${reason}`, member.user, logType.neutral, author.user);
            // send embed.
            return { type: "embed", content: embed };
        } catch (e) {
            console.log(e);
            return { type: "text", content: "an error occured" };
        }
    },
};