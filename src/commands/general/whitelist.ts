import axios from "axios";
import { Client, GuildMember } from "discord.js";
import { Rcon } from "rcon-client";
import { argType, Iresponse } from "../../interfaces";
import { defaultErr } from "../../middleware/modules";
import settings from "../../../settings.json"

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
            "required": true
        }
    ],

    throttling: {
        duration: 60,
        usages: 2,
    },

    async execute(author: GuildMember, { username }: { username: string }, { conn }: Client): Promise<Iresponse> {
        try {
            username = username.substr(0, 64);
            // Check if right server.
            if (author.guild.id !== "823993381591711786") return { type: "disabled", content: "Not allowed in this guild." };

            // Check if sub.
            if (!author.roles.cache.has("831881973348827136")) return { type: "text", content: "You have to be a sub to use this command." };
            
            // rcon connect.
            const rcon = await Rcon.connect({ host: settings.rcon.host, port: settings.rcon.port, password: settings.rcon.pass });
            
            // Check if account exists.
            const id = await accountExists(username);
            
            // Check if should continue.
            if (!id) return { type: "text", content: "mc account doesn't exist" };
            
            // Check if already registered.
            const query = await conn.query("SELECT * FROM Whitelist WHERE UserID = ? OR UUID = ?", [author.id, id]);
            if (query[0] !== undefined) return { type: "text", content: "You already have an account linked." };

            // Try to whitelist.
            const response = await rcon.send(`whitelist add ${username}`);
            rcon.end();

            // If already whitelisted.
            if (response === "Player is already whitelisted") return { type: "text", content: "That name is already whitelisted" };

            // Add to db.
            conn.query("INSERT INTO Whitelist (UserID, UUID, Date) VALUES (?,?,?)", [author.id, id, Date.now()]);

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

async function accountExists(username: string) {
    let code = false;
    await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`)
        .then(response => {
            code = response.status === 200 ? response.data.id : false;
        })
    return code;
}