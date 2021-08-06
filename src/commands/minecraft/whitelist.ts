import { getMcUUID, defaultErr, RCONHandler } from "../../modules/modules";
import logHandler from "../../middleware/logHandler";
import { Logs_Event } from "@prisma/client";
import { GuildMember } from "discord.js";
import { Command, OwlClient } from "../../types/classes";
import { argType, MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "whitelist",
            aliases: ["mc"],
            description: "whitelists to server",
            example: "Notch",
            group: "general",

            guildOnly: true,
            adminOnly: false,
            slash: false,

            args: [
                {
                    "type": argType.string,
                    "name": "username",
                    "description": "which mc name to add",
                    "default": false,
                    "required": true,
                },
            ],

            throttling: {
                duration: 60,
                usages: 2,
            },

            permissions: {
                self: ["MANAGE_ROLES"],
            },
        });
    }

    async run(author: GuildMember, { username }: { username: string }, { db }: OwlClient): Promise<MsgResponse> {
        try {
            username = username.trim().substr(0, 64);
            const userID = author.id;

            // Get guild.
            const rconGuild = await db.rCON.findFirst({ where: { GuildID: author.guild.id } });

            // Check if connected server.
            if (rconGuild === null) return { content: "No minecraft server connected to this guild." };

            // Get UUID
            let uuid = await getMcUUID(username);

            // Check if exists.
            if (!uuid) return { content: "mc account doesn't exist" };
            uuid = uuid as string;

            // Check if already registered.
            const userExists = await db.whitelist.findFirst({ where: { OR: [{ UserID: userID }, { UUID: uuid }] } });

            // Check if already in db.
            if (userExists !== null) return { content: "You already have an account linked." };

            // Execute command.
            const response = await RCONHandler(`whitelist add ${username}`, { host: rconGuild.Host, port: rconGuild.Port, password: rconGuild.Password });

            // If already whitelisted.
            if (response.code !== "SUCCESS") return { content: response.message };

            // Add to db.
            await db.whitelist.create({ data: { UserID: userID, UUID: uuid, GuildID: author.guild.id } });

            // Give role.
            if (rconGuild.RoleID) author.roles.add(rconGuild.RoleID);

            // Log it.
            logHandler(Logs_Event.Whitelist_Add, author.guild.id, author.user, uuid);

            // Respond.
            return { content: "You've been whitelisted!" };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};