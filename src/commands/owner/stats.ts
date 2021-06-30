import { User, GuildMember, MessageEmbed } from "discord.js";
import { Command, OwlClient } from "../../types/classes";
import { MsgResponse } from "../../types/types";
import moment from "moment";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "stats",
            aliases: [""],
            description: "shows bot status",
            example: "a",
            group: "moderator",

            guildOnly: false,
            adminOnly: true,
            slash: false,

            throttling: {
                usages: 0,
                duration: 0,
            },
        });
    }

    async run(author: User | GuildMember, _undefined: undefined, client: OwlClient): Promise<MsgResponse> {
        if ("user" in author) author = author.user;

        const embed = new MessageEmbed()
            .addFields(
                { name: "Users", value: client.users.cache.size, inline: true },
                { name: "Servers", value: client.guilds.cache.size, inline: true },
                { name: "Channels", value: client.channels.cache.size, inline: true },
            )
            .addField("Memory usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, true)
            .addField("Uptime", moment(Date.now() - client.uptime!).fromNow().replace(" ago", ""), true)
            .setFooter(`${author.username} <${author.id}>`, author.avatarURL() as string | undefined)
            .setColor("#FF0000")
            .setTimestamp();

        return { type: "embed", content: embed };
    }
};