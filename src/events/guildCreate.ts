import { Logs_Event } from "@prisma/client";
import colors from "colors";
colors.enable();

import { Guild } from "discord.js";
import logHandler from "../middleware/logHandler";
import { OwlClient } from "../types/classes";

export default function guildCreate(client: OwlClient) {
    const db = client.db;
    return async (guild: Guild) => {
        try {

            await db.guilds.create({ data: { GuildID: guild.id } });

            logHandler(Logs_Event.Guild_Add, guild.id);

            return;
        } catch (error) {
            console.error(error);
            return;
        }
    };
}
