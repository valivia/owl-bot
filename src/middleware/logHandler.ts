import colors from "colors";
import { Channel, Client, Guild, MessageEmbed, User } from "discord.js";
import { Options } from "../../settings.json"
colors.enable();

let channel: Channel;

export default async function logHandler(title: string, context: string, author: User, type: logType, mod: User | undefined = undefined) {
    // 0 = green
    // 1 = red
    // other = purple
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
    channel.send(embed)
    return;
}

export async function fetchChannel(client: Client) {
    // fetch guild.
    const guild: Guild = client.guilds.cache.get(Options.guild);
    channel = guild.channels.cache.get(Options.channel);
    if (channel === undefined) { 
        console.log("Could not fetch log channel.".bgRed)
        process.exit(1)
    }
}