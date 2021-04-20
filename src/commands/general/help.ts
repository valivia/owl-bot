import { Message, MessageEmbed } from "discord.js";
import { Options } from "../../../settings.json";
import { ICommands } from "../../interfaces";

module.exports = {
    name: "help",

    aliases: ["?"],
    description: "shows all available commands.",
    examples: [""],
    group: "general",
    throttling: {
        duration: 10,
        usages: 1,
    },

    execute(msg: Message, args: string[]) {
        const { commands } = msg.client;
        console.log(commands);

        if (args.length < 1) {
            let cmds = "";
            for (const [ , { name, description } ] of commands) { cmds += `\n**${name}:** ${description}`; }
            const list = new MessageEmbed()
            .setTitle("Available commands")
            .addFields(
                { name: "general commands", value: cmds},
                { name: "\u200B", value: "\u200B" },
            )
            .addField("more info?", `type ${Options.prefix}help (command name), to get more info on a command.`)
            .setColor("#FF0000")
            .setTimestamp();

            return msg.author.send(list)
                .then(() => {
                    if (msg.channel.type === "dm") { return; }
                    msg.react("709511914962681888");
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${msg.author.tag}.\n`, error);
                    msg.reply("cannot send a DM.");
                });
        }

        const cmdName = args[0].toLowerCase();
        const command = commands.get(cmdName) as ICommands || commands.find(c => c.aliases && c.aliases.includes(cmdName));

        if (command === undefined) {
            return msg.reply("Invalid command");
        }

        const embed = new MessageEmbed()
        .setAuthor(msg.author.username, `${msg.author.avatarURL()}`)
        .setTitle(command.name)
        .addField("Description", command.description !== undefined ? command.description : "-")
        .addField("Aliases", command.aliases.length < 1 ? command.aliases.join(", ") : "No Aliases available for this command.", true)
        .addField("Example", command.example !== undefined ? `\`\`${Options.prefix}${command.name} ${command.example}\`\`` : "No example provided.", true)
        .addField("cooldown", command.throttling !== undefined ? command.throttling.duration : "none")
        .setColor("#FF0000")
        .setTimestamp();

        return msg.channel.send(embed);
    },
};