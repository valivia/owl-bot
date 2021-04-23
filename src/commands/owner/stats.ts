import { Client, MessageEmbed, User } from "discord.js";
import moment from "moment";
import { Iresponse } from "../../interfaces";

module.exports = {
    name: "stats",
    aliases: [""],
    description: "shows bot status",
    examples: [""],
    group: "moderator",

    guildOnly: false,
    adminOnly: true,
    slash: false,


    async execute(author: User, undefined: undefined, client: Client): Promise<Iresponse> {
        if (author.user !== undefined) {
            author = author.user
        }
        const embed = new MessageEmbed()
            .addFields(
                { name: "Users", value: await client.users.cache.size, inline: true },
                { name: "Servers", value: client.guilds.cache.size, inline: true },
                { name: "Channels", value: client.channels.cache.size, inline: true },
            )
            .addField("Memory usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, true)
            .addField("Uptime", moment(Date.now() - client.uptime).fromNow().replace(" ago", ""), true)
            .setFooter(`${author.username} <${author.id}>`, author.avatarURL())
            .setColor("#FF0000")
            .setTimestamp();

        return { type: "embed", content: embed }
    },
};