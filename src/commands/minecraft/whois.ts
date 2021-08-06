import { GuildMember } from "discord.js";
import { getMcUUID, defaultErr } from "../../modules/modules";
import { Command, OwlClient } from "../../types/classes";
import { argType, MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
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
                    "required": true,
                },
            ],

            throttling: {
                duration: 60,
                usages: 2,
            },
        });
    }

    async run(_author: GuildMember, { username }: { username: string }, client: OwlClient): Promise<MsgResponse> {
        try {
            username = username.substr(0, 64);

            // Check if account exists.
            const id = await getMcUUID(username);

            // Check if should continue.
            if (!id) return { content: "mc account doesn't exist" };

            // get username
            const query = await client.db.whitelist.findFirst({ where: { UUID: id as string } });

            if (query === null) return { content: "No account linked.." };

            const user = await client.users.fetch(query.UserID);

            if (user === null) return { content: "couldnt find user." };
            // Respond.
            return { content: `${user.tag} - ${user.id}` };
        } catch (e) {
            console.log(e);
            // If cant connect to mc server.
            return defaultErr;
        }
    }
};