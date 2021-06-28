import { Logs_Event } from "@prisma/client";
import { Client, GuildMember, MessageEmbed } from "discord.js";
import { argType, Iresponse } from "../../interfaces";
import logHandler from "../../middleware/logHandler";
import { defaultErr } from "../../middleware/modules";

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
            "required": true,
        },
        {
            "type": argType.string,
            "name": "reason",
            "description": "Reason why the user is getting warned",
            "default": false,
            "required": false,
        },
    ],

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(author: GuildMember, { member, reason }: { member: GuildMember, reason: string }, { conn }: Client): Promise<Iresponse> {
        if (reason === undefined) { reason = "No reason provided"; }
        try {
            // insert into db.
            await conn.warnings.create({ data: { UserID: member.id, Reason: reason.substr(0, 256), GuildID: member.guild?.id, ModID: author.id } })
                .catch(e => {
                    console.log(e);
                    return { type: "text", content: "an error occured" };
                });

            const warnCount = await conn.warnings.count({ where: { UserID: member.id, GuildID: member.guild.id } });

            let colour: string;

            switch (warnCount) {
                case 1: colour = "#18ac15"; break;
                case 2: colour = "#d7b500"; break;
                default: colour = "#e60008"; break;
            }

            // make embed.
            const embed = new MessageEmbed()
                .setAuthor(`${member.user.username}#${member.user.discriminator} has been warned, ${warnCount} total`)
                .setDescription(`**reason:** ${reason}`)
                .setColor(colour);

            logHandler(Logs_Event.Warn_Add, author.guild.id, member.user, reason, author.user);

            // send embed.
            return { type: "embed", content: embed };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};