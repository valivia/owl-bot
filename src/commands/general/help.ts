import { GuildMember, User, MessageEmbed } from "discord.js";
import { getCommand } from "../../modules/modules";
import { Command, OwlClient } from "../../types/classes";
import { argType, MsgResponse } from "../../types/types";
import env from "dotenv";
env.config();

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "help",
            aliases: ["?"],
            description: "shows all help commands",
            example: "",
            group: "general",

            guildOnly: false,
            adminOnly: false,
            slash: true,

            args: [
                {
                    "type": argType.string,
                    "name": "commandName",
                    "description": "what command do you want info on?",
                    "default": false,
                    "required": false,
                },
            ],

            throttling: {
                duration: 30,
                usages: 1,
            },
        });
    }

    async run(author: GuildMember | User, { commandName }: { commandName: string | undefined; }, client: OwlClient): Promise<MsgResponse> {
        const { commands } = client;
        let dm = true;
        if ("user" in author) {
            author = author.user;
            dm = false;
        }

        if (commandName === undefined) {
            let cmds = "";
            for (const [, { name, description, disabled }] of commands) {
                if (disabled && author.id !== process.env.OWNER) { continue; }
                cmds += `\n**${disabled ? "-" : ""}${name}:** ${description}`;
            }
            const list = new MessageEmbed()
                .setTitle("Available commands")
                .addFields(
                    { name: "general commands", value: cmds },
                    { name: "\u200B", value: "\u200B" },
                )
                .addField("more info?", `type ${process.env.PREFIX}help (command name), to get more info on a command.`)
                .setColor("#FF0000")
                .setTimestamp();
            // Send list directly if requested from dms.
            if (dm) { return { embeds: [list] }; }

            // Dm list.
            await author.send({ embeds: [list] })
                .catch(_ => { return { content: "Couldn't dm you." }; });
            // Send acknowledgement.
            return { content: "Dm with info sent!" };
        }

        const cmdName = commandName?.toLowerCase();
        const command = getCommand(client, cmdName);

        if (!command) {
            return { content: "invalid command.." };
        }
        const alias = command.aliases.length < 1 ? command.aliases.join(", ") : "No Aliases available for this command.";

        const embed = new MessageEmbed()
            .setAuthor(author.username, `${author.avatarURL()}`)
            .setTitle(command.name)
            .addField("Description", command.description !== undefined ? command.description : "-")
            .addField("Aliases", alias, true)
            .addField("Example", command.example !== undefined ? `\`\`${process.env.PREFIX}${command.name} ${command.example}\`\`` : "No example provided.", true)
            .addField("cooldown", `${command.throttling !== undefined ? command.throttling.duration : "none"}`)
            .setColor("#FF0000")
            .setTimestamp();

        return { embeds: [embed] };
    }
};