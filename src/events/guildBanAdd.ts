import colors from "colors";
colors.enable();

import { Client, Guild, User } from "discord.js";
import { Rcon } from "rcon-client";
import settings from "../../settings.json"
import logHandler from "../middleware/logHandler";
import { logType } from "../interfaces";
import { getName } from "../middleware/modules";

export const name = "guildBanAdd";

export default function guildBanAdd(client: Client) {
    const conn = client.conn;
    return async (guild: Guild, user: User) => {
        try {
            // Log.
            logHandler("member banned", "", user, logType.good);
            // Check if right server.
            if (guild.id !== "823993381591711786") return;

            // Query db.
            let query = await conn.whitelist.findFirst({ where: { UserID: user.id } });

            if (query === null) return;

            // Get username.
            const username = await getName(query.UUID);

            if (!username) {
                console.log(`COULD NOT FETCH BANNED MEMBER'S NAME ${user.id}`.red.bold);
                return;
            }

            // rcon connect.
            const rcon = await Rcon.connect({ host: settings.rcon.host, port: settings.rcon.port, password: settings.rcon.pass });

            // Try remove from whitelist.
            const response = await rcon.send(`whitelist remove ${username}`);
            rcon.end();

            console.log(response);

            await conn.whitelist.delete({ where: { UserID: user.id } });

            return;
        } catch (error) {
            console.error(error);
            return;
        }
    };
}
