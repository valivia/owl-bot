import colors from "colors";
colors.enable();

import { Client, Guild, User } from "discord.js";
export const name = "guildMemberRemove";

export default function guildMemberRemove(client: Client) {
    return async (guild: Guild, user: User) => {
        try {
            console.log(`member left ${user.tag} - ${user.id}`)
            return;
        } catch (error) {
            console.error(error);
            return;
        }
    };
}
