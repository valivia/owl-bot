import { Client, GuildMember } from "discord.js";
import { Rcon } from "rcon-client";
import { argType, Iresponse } from "../../interfaces";
import { accountExists, defaultErr } from "../../middleware/modules";
import settings from "../../../settings.json";
import logHandler from "../../middleware/logHandler";
import { Logs_Event } from "@prisma/client";

module.exports = {
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
        {
            "type": argType.user,
            "name": "member",
            "description": "which user to whitelist",
            "default": false,
            "required": false,
        },

    ],

    throttling: {
        duration: 60,
        usages: 2,
    },

    async execute(author: GuildMember, { username, member }: { username: string, member: GuildMember }, { conn }: Client): Promise<Iresponse> {
        try {
            username = username.substr(0, 64);
            console.log(member.id);
            const userID = member.id !== undefined ? member.id : author.id;
            // Check if right server.
            if (author.guild.id !== "823993381591711786") return { type: "disabled", content: "Not allowed in this guild." };

            // Check if sub.
            if (!author.roles.cache.has("841690912748208158") && author.id !== settings.Options.owner) {
                return { type: "text", content: "You have to be a sub to use this command." };
            }

            // Check if account exists.
            const id = await accountExists(username);

            // Check if should continue.
            if (!id) return { type: "text", content: "mc account doesn't exist" };

            // Check if already registered.
            const query = await conn.whitelist.findFirst({
                where: {
                    OR: [
                        { UserID: userID },
                        { UUID: id as string },
                    ],
                },
            });

            if (query !== null) return { type: "text", content: "You already have an account linked." };
            // rcon connect.
            const rcon = await Rcon.connect({ host: settings.rcon.host, port: settings.rcon.port, password: settings.rcon.pass });

            // Try to whitelist.
            const response = await rcon.send(`whitelist add ${username}`);
            rcon.end();

            // If already whitelisted.
            if (response === "Player is already whitelisted") return { type: "text", content: "That name is already whitelisted" };

            // Add to db.
            await conn.whitelist.create({ data: { UserID: userID, UUID: id as string, GuildID: author.guild.id, Permanent: member.id !== undefined ? true : false } });

            // Give role.
            if (member.id !== undefined) {
                member.roles.add("840565782361407553");
            } else {
                author.roles.add("840565782361407553");
            }

            // Log it.
            logHandler(Logs_Event.Whitelist_Add, author.guild.id, author.user, id as string);

            // Respond.
            return { type: "text", content: "You've been whitelisted!" };
        } catch (e) {
            console.log(e);
            // If cant connect to mc server.
            if (e.errno === "ECONNREFUSED") return { type: "text", content: "Couldn't connect to the mc server please contact the bot owner." };
            return defaultErr;
        }
    },
};