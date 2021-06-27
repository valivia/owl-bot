import { Logs_Event } from "@prisma/client";
import colors from "colors";
colors.enable();

import { Client, Guild, User } from "discord.js";
import logHandler from "../middleware/logHandler";
export const name = "guildMemberRemove";

export default function guildMemberRemove(_client: Client) {
    return async (guild: Guild, user: User) => {
        try {
            logHandler(Logs_Event.Member_Leave, guild.id, user);
            console.log(`member left ${user.tag} - ${user.id}`)
            return;
        } catch (error) {
            console.error(error);
            return;
        }
    };
}
