import { Client, GuildMember, Message, MessageEmbed, User } from "discord.js";
import { Options } from "../../../settings.json";
import { ICommands, Iresponse } from "../../interfaces";

module.exports = {
    name: "help",
    aliases: ["?"],
    description: "shows all help commands",
    examples: [""],
    group: "general",

    guildOnly: false,
    adminOnly: false,
    slash: false,

    args: [
        {
            "type": "string",
            "name": "commandName",
            "description": "what command do you want info on?",
            "default": false,
            "required": false
        }
    ],

    throttling: {
        duration: 30,
        usages: 1,
    },

    async execute(author: User, { commandName }: { commandName: string | undefined; }, client: Client): Promise<Iresponse> {
        const { commands } = client;
        let dm = true;
        if (author.user !== undefined) {
            author = author.user
            dm = false;
        }

        if (commandName === undefined) {
            let cmds = "";
            for (const [, { name, description }] of commands) { cmds += `\n**${name}:** ${description}`; }
            const list = new MessageEmbed()
                .setTitle("Available commands")
                .addFields(
                    { name: "general commands", value: cmds },
                    { name: "\u200B", value: "\u200B" },
                )
                .addField("more info?", `type ${Options.prefix}help (command name), to get more info on a command.`)
                .setColor("#FF0000")
                .setTimestamp();
            // Send list directly if requested from dms.
            if (dm) { return { type: "embed", content: list } }

            // Dm list.
            await author.send(list)
                .catch(_ => { return { type: "text", content: "Couldn't dm you." } });
            // Send acknowledgement.
            return { type: "text", content: "Dm with info sent!" };
        }

        const cmdName = commandName?.toLowerCase();
        const command = commands.get(cmdName) as ICommands || commands.find(c => c.aliases && c.aliases.includes(cmdName));

        if (command === undefined) {
            return { type: "text", content: "invalid command.." }
        }

        const embed = new MessageEmbed()
            .setAuthor(author.username, `${author.avatarURL()}`)
            .setTitle(command.name)
            .addField("Description", command.description !== undefined ? command.description : "-")
            .addField("Aliases", command.aliases.length < 1 ? command.aliases.join(", ") : "No Aliases available for this command.", true)
            .addField("Example", command.example !== undefined ? `\`\`${Options.prefix}${command.name} ${command.example}\`\`` : "No example provided.", true)
            .addField("cooldown", command.throttling !== undefined ? command.throttling.duration : "none")
            .setColor("#FF0000")
            .setTimestamp();

        return { type: "embed", content: embed }
    },
};