import { Logs_Event } from "@prisma/client";
import { GuildMember, MessageEmbed } from "discord.js";
import logHandler from "../../middleware/logHandler";
import { Command, OwlClient } from "../../types/classes";
import { argType, MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
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
        });
    }

    async run(author: GuildMember, { member, reason }: { member: GuildMember, reason: string }): Promise<MsgResponse> {
        if (reason === undefined) { reason = "No reason provided"; }
        try {
            const result = await member.kick(reason).catch(() => { return false; });

            if (typeof (result) == "boolean") return { content: "Can't kick that person" };

            const embed = new MessageEmbed()
                .setAuthor(`${member.user.username}#${member.user.discriminator} has been kicked`)
                .setDescription(`**reason:** ${reason}`)
                .setColor(5362138);

            logHandler(Logs_Event.Kick, author.guild.id, member.user, reason, author.user);

            return { embeds: [embed] };
        } catch (e) {
            console.log(e);
            return { content: "an error occured" };
        }
    }
};