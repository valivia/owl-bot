import { GuildMember, MessageEmbed } from "discord.js";
import { defaultErr } from "../../middleware/modules";
import { Command, OwlClient } from "../../types/classes";
import { argType, MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
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
                    "required": true,
                },
                {
                    "type": argType.integer,
                    "name": "number",
                    "description": "which warning.",
                    "default": false,
                    "required": true,
                },
            ],

            throttling: {
                duration: 30,
                usages: 3,
            },
        });
    }

    async run(_author: GuildMember, { member, number }: { member: GuildMember, number: number }, client: OwlClient): Promise<MsgResponse> {
        const db = client.db;
        if (number < 1) { return { type: "content", content: "Invalid index" }; }

        try {
            const query = await db.warnings.findFirst({
                where: {
                    UserID: member.id,
                    GuildID: member.guild.id,
                },
                orderBy: { Created: "asc" },
                skip: number - 1,
            });

            if (query === null) return { type: "content", content: "Out of bounds." };

            await db.warnings.delete({ where: { ID: query.ID } });

            const embed = new MessageEmbed()
                .setAuthor(`${member.user.username}#${member.user.discriminator}'s ${number}${number > 1 ? "nd" : "st"} warning was removed`)
                .setColor(5362138);

            return { type: "embed", content: embed };
        } catch (e) {
            console.error(e);

            return defaultErr;
        }
    }
};