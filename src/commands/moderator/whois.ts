import { Client, GuildMember } from "discord.js";
import { argType, Iresponse } from "../../interfaces";
import { accountExists, defaultErr, getUser } from "../../middleware/modules";

module.exports = {
    name: "whois",
    aliases: [""],
    description: "shows discord name of mc player",
    example: "valivia",
    group: "moderator",

    guildOnly: false,
    adminOnly: false,
    slash: false,

    args: [
        {
            "type": argType.string,
            "name": "username",
            "description": "which mc user to check",
            "default": false,
            "required": true
        }
    ],

    throttling: {
        duration: 60,
        usages: 2,
    },

    async execute(_author: GuildMember, { username }: { username: string }, client: Client): Promise<Iresponse> {
        try {
            username = username.substr(0, 64);

            // Check if account exists.
            const id = await accountExists(username);

            // Check if should continue.
            if (!id) return { type: "text", content: "mc account doesn't exist" };

            // get username
            const query = await client.conn.whitelist.findFirst({ where: { UUID: id as string } })

            if (query === null) return { type: "text", content: "No account linked.." };

            const user = await getUser(client, query.UserID);

            if (user === null) return { type: "text", content: "couldnt find user." };
            // Respond.
            return { type: "text", content: `${user.tag} - ${user.id}` };
        } catch (e) {
            console.log(e);
            // If cant connect to mc server.
            return defaultErr;
        }
    },
};