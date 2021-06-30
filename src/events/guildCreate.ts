import { Logs_Event } from "@prisma/client";
import colors from "colors";
colors.enable();

import { OwlClient, Guild } from "discord.js";
import logHandler from "../middleware/logHandler";

export default function guildCreate(client: OwlClient) {
    const conn = client.conn;
    return async (guild: Guild) => {
        try {

            await conn.settings.create({ data: { GuildID: guild.id } });

            logHandler(Logs_Event.Guild_Add, guild.id);

            return;
        } catch (error) {
            console.error(error);
            return;
        }
    };
}
