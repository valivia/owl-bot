import { User, GuildMember, MessageEmbed } from "discord.js";
import { Command, OwlClient } from "../../types/classes";
import { MsgResponse } from "../../types/types";
import moment from "moment";
import { cpuUsage } from "process";

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

        const users = client.guilds.cache.reduce((acc, { memberCount }) => acc + memberCount, 0);

        console.log(cpuUsage());
        const embed = new MessageEmbed()
            .addFields([
                { name: "Users", value: users.toString(), inline: true },
                { name: "Servers", value: client.guilds.cache.size.toString(), inline: true },
                { name: "Channels", value: client.channels.cache.size.toString(), inline: true },
            ])
            .addField("Memory usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, true)
            .addField("Uptime", moment(Date.now() - client.uptime!).fromNow().replace(" ago", ""), true)
            .addField("Commands", `${client.commands.size} loaded modules`, true)
            .setFooter(`${author.username} <${author.id}>`, author.avatarURL() as string | undefined)
            .setColor("#FF0000")
            .setTimestamp();

        return { embeds: [embed] };
    }
};