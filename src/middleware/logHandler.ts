import { Logs_Event } from "@prisma/client";
import colors from "colors";
import { Client, Guild, GuildChannel, MessageEmbed, User } from "discord.js";
import { Options } from "../../settings.json"
colors.enable();

let channel: GuildChannel;

export let client: Client;

export default async function logHandler(type: Logs_Event, guild: string, user?: User, content?: string, mod?: User | undefined) {

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
export function initLog(Client: Client) {
    client = Client;
}

export async function fetchChannel(client: Client): Promise<void> {
    // fetch guild.
    const guild: Guild = client.guilds.cache.get(Options.guild);
    channel = guild.channels.cache.get(Options.channel);
    if (channel === undefined) {
        console.log("Could not fetch log channel.".bgRed);
        process.exit(1);
    }
}