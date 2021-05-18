import { Client, GuildMember, MessageEmbed } from "discord.js";
import { argType, Iresponse, logType } from "../../interfaces";
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
            "required": true
        },
        {
            "type": argType.string,
            "name": "reason",
            "description": "Reason why the user is getting kicked",
            "default": false,
            "required": false
        }
    ],

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(author: GuildMember, { member, reason }: { member: GuildMember, reason: string }): Promise<Iresponse> {
        if (reason === undefined) { reason = "No reason provided" }
        try {
            member.kick(reason);

            let embed = new MessageEmbed()
                .setAuthor(`${member.user.username}#${member.user.discriminator} has been kicked`)
                .setDescription(`**reason:** ${reason}`)
                .setColor(5362138)

            logHandler("kicked", `kicked for ${reason}`, member.user, logType.neutral, author.user)
            // send embed.
            return { type: "embed", content: embed };
        } catch (e) {
            console.log(e);
            return { type: "text", content: "an error occured" };
        }
    },
};