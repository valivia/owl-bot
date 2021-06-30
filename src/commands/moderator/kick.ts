import { Logs_Event } from "@prisma/client";
import { GuildMember, MessageEmbed } from "discord.js";
import { argType, Iresponse } from "../../interfaces";
import logHandler from "../../middleware/logHandler";

module.exports = {
    name: "kick",
    aliases: [""],
    description: "kicks a user",
    example: "@valivia being cringe",
    group: "moderator",

    guildOnly: true,
    adminOnly: false,
    slash: true,

    args: [
        {
            "type": argType.user,
            "name": "member",
            "description": "User to kick",
            "default": false,
            "required": true,
        },
        {
            "type": argType.string,
            "name": "reason",
            "description": "Reason why the user is getting kicked",
            "default": false,
            "required": false,
        },
    ],

    permissions: {
        self: ["KICK_MEMBERS"],
        user: ["KICK_MEMBERS"],
    },

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(author: GuildMember, { member, reason }: { member: GuildMember, reason: string }): Promise<Iresponse> {
        if (reason === undefined) { reason = "No reason provided"; }
        try {
            const result = await member.kick(reason).catch(() => { return false; });

            if (typeof (result) == "boolean") return { type: "text", content: "Can't kick that person" };

            const embed = new MessageEmbed()
                .setAuthor(`${member.user.username}#${member.user.discriminator} has been kicked`)
                .setDescription(`**reason:** ${reason}`)
                .setColor(5362138);

            logHandler(Logs_Event.Kick, author.guild.id, member.user, reason, author.user);

            return { type: "embed", content: embed };
        } catch (e) {
            console.log(e);
            return { type: "text", content: "an error occured" };
        }
    },
};