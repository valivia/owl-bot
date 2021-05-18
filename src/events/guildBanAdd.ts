import colors from "colors";
colors.enable();

import axios from "axios";
import { Client, Guild, User } from "discord.js";
import { Rcon } from "rcon-client";
import settings from "../../settings.json"

export const name = "guildBanAdd";

export default function guildBanAdd(client: Client) {
    const conn = client.conn;
    return async (guild: Guild, user: User) => {
        try {
            if (guild.id !== "823993381591711786") return;
            console.log(user.id);
            let query = await conn.whitelist.findUnique({ where: { UserID: user.id } });

            if (query === null) return;

            const username = await getName(query.UUID);

            if (!username) {
                console.log(`COULD NOT FETCH BANNED MEMBER'S NAME ${user.id}`.red.bold);
                return;
            }

            // rcon connect.
            const rcon = await Rcon.connect({ host: settings.rcon.host, port: settings.rcon.port, password: settings.rcon.pass });

            // Try to whitelist.
            const response = await rcon.send(`whitelist remove ${username}`);
            rcon.end();

            console.log(response);

            return;
        } catch (error) {
            console.error(error);
            return;
        }
    };
}

async function getName(uuid: string) {
    let userName = false;
    await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
        .then(response => {
            userName = response.status === 200 ? response.data.name : false;
        })
    return userName;
}