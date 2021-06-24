import colors from "colors";
import { Client, Guild, GuildChannel, MessageEmbed, User } from "discord.js";
import { Options } from "../../settings.json"
import { logType } from "../interfaces";
colors.enable();

let channel: GuildChannel;

export let client: Client;

export default async function logHandler(title: string, context: string, author: User, type: logType, mod: User | undefined = undefined) {
    const embed = new MessageEmbed()
        .addField(title, context)
        .setColor(type)
        .setFooter(`${author.username} <@${author.id}>`, author.displayAvatarURL())
        .setTimestamp();

    // add mod if provided.
    if (mod) {
        embed.setAuthor(mod.username, mod.displayAvatarURL())
    }


    // send.
    // channel.send(embed)
    return;
}

export async function fetchChannel(client: Client): Promise<void> {
    // fetch guild.
    const guild: Guild = client.guilds.cache.get(Options.guild);
    channel = guild.channels.cache.get(Options.channel);
    if (channel === undefined) {
        console.log("Could not fetch log channel.".bgRed)
        process.exit(1)
    }
}