import { Logs_Event } from "@prisma/client";
import colors from "colors";
import { Client, MessageEmbed, User } from "discord.js";
colors.enable();

export let client: Client;

export default async function logHandler(type: Logs_Event, guild: string, user?: User, content?: string, mod?: User | undefined): Promise<void> {

    if (user === undefined) { user = client.user as User; }

    const embed = new MessageEmbed()
        .addField(type, content)
        .setColor(type)
        .setFooter(`${user.username} <@${user.id}>`, user.displayAvatarURL())
        .setTimestamp();

    // add mod if provided.
    if (mod) {
        embed.setAuthor(mod.username, mod.displayAvatarURL());
    }

    await client.conn.logs.create({ data: { GuildID: guild, UserID: user.id, Event: type, Content: content } });


    // send.
    // channel.send(embed)
    return;
}
export function initLog(clientVar: Client): void {
    client = clientVar;
}