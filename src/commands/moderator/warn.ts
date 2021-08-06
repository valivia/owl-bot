import { Logs_Event } from "@prisma/client";
import { GuildMember, MessageEmbed } from "discord.js";
import logHandler from "../../middleware/logHandler";
import { defaultErr } from "../../modules/modules";
import { Command, OwlClient } from "../../types/classes";
import { argType, MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
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
        });
    }

    async run(author: GuildMember, { member, reason }: { member: GuildMember, reason: string }, { db }: OwlClient): Promise<MsgResponse> {
        if (reason === undefined) { reason = "No reason provided"; }
        try {
            // insert into db.
            await db.warnings.create({ data: { UserID: member.id, Reason: reason.substr(0, 256), GuildID: member.guild?.id, ModID: author.id } })
                .catch(e => {
                    console.log(e);
                    return { content: "an error occured" };
                });

            const warnCount = await db.warnings.count({ where: { UserID: member.id, GuildID: member.guild.id } });

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
            return { embeds: [embed] };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};