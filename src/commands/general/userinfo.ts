import { GuildMember, MessageEmbed } from "discord.js";
import { defaultErr } from "../../middleware/modules";
import { Command, OwlClient } from "../../types/classes";
import { argType, MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "userinfo",
            aliases: ["info", "user"],
            description: "View user data",
            example: "",
            group: "general",

            guildOnly: true,
            adminOnly: false,
            slash: false,

            args: [
                {
                    "type": argType.user,
                    "name": "member",
                    "description": "Who's info to get",
                    "default": false,
                    "required": true,
                },

            ],

            permissions: {
                self: [],
                user: [],
            },

            throttling: {
                duration: 60,
                usages: 2,
            },
        });
    }

    public async run(author: GuildMember, { member }: { member: GuildMember | undefined }): Promise<MsgResponse> {
        try {
            member = member !== undefined ? member : author;
            const user = member.user;

            const embed = new MessageEmbed()
                .setTitle(`Info on **${user.username}#${user.discriminator}** (ID: ${user.id})`)
                .setThumbnail(member.user.avatarURL() as string)
                .setDescription([`User stats of *${user.username}*`])
                .addField(`**Member Details**`,
                    (member.nickname !== null ? `• **Nickname:** ${member.nickname}` : "• **No nickname**") + `\n• **Roles:** ${member.roles.cache.map(roles => `\`${roles.name}\``).join(", ")}\n• **Joined at:** ${member.joinedAt}`)
                .addField("**User Details**",
                    `• **Created at:** ${user.createdAt}` + (user.bot ? "\n• **Is a bot account**" : "") + `\n• **Status:** ${user.presence.status}\n• **Game:** ` + (user.presence.game ? user.presence.game.name : "None"));

            return { type: "embed", content: embed };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};