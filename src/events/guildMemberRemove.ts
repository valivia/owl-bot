import { Logs_Event } from "@prisma/client";
import colors from "colors";
colors.enable();

import { OwlClient, Guild, User } from "discord.js";
import logHandler from "../middleware/logHandler";

export default function guildMemberRemove(_client: OwlClient) {
    return async (guild: Guild, user: User) => {
        try {
            if (!guild) { return; }
            if (!user) { return; }
            logHandler(Logs_Event.Member_Leave, guild.id, user);
            console.log(`member left ${user.tag} - ${user.id}`);
            return;
        } catch (error) {
            console.error(error);
            return;
        }
    };
}
