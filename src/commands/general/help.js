"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const settings_json_1 = require("../../../settings.json");
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
    execute(author, { commandName }, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const { commands } = client;
            let dm = true;
            if (author.user !== undefined) {
                author = author.user;
                dm = false;
            }
            if (commandName === undefined) {
                let cmds = "";
                for (const [, { name, description }] of commands) {
                    cmds += `\n**${name}:** ${description}`;
                }
                const list = new discord_js_1.MessageEmbed()
                    .setTitle("Available commands")
                    .addFields({ name: "general commands", value: cmds }, { name: "\u200B", value: "\u200B" })
                    .addField("more info?", `type ${settings_json_1.Options.prefix}help (command name), to get more info on a command.`)
                    .setColor("#FF0000")
                    .setTimestamp();
                // Send list directly if requested from dms.
                if (dm) {
                    return { type: "embed", content: list };
                }
                // Dm list.
                yield author.send(list)
                    .catch(_ => { return { type: "text", content: "Couldn't dm you." }; });
                // Send acknowledgement.
                return { type: "text", content: "Dm with info sent!" };
            }
            const cmdName = commandName === null || commandName === void 0 ? void 0 : commandName.toLowerCase();
            const command = commands.get(cmdName) || commands.find(c => c.aliases && c.aliases.includes(cmdName));
            if (command === undefined) {
                return { type: "text", content: "invalid command.." };
            }
            const embed = new discord_js_1.MessageEmbed()
                .setAuthor(author.username, `${author.avatarURL()}`)
                .setTitle(command.name)
                .addField("Description", command.description !== undefined ? command.description : "-")
                .addField("Aliases", command.aliases.length < 1 ? command.aliases.join(", ") : "No Aliases available for this command.", true)
                .addField("Example", command.example !== undefined ? `\`\`${settings_json_1.Options.prefix}${command.name} ${command.example}\`\`` : "No example provided.", true)
                .addField("cooldown", command.throttling !== undefined ? command.throttling.duration : "none")
                .setColor("#FF0000")
                .setTimestamp();
            return { type: "embed", content: embed };
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlbHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBd0Q7QUFDeEQsMERBQWlEO0FBR2pELE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixJQUFJLEVBQUUsTUFBTTtJQUNaLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNkLFdBQVcsRUFBRSx5QkFBeUI7SUFDdEMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ2QsS0FBSyxFQUFFLFNBQVM7SUFFaEIsU0FBUyxFQUFFLEtBQUs7SUFDaEIsU0FBUyxFQUFFLEtBQUs7SUFDaEIsS0FBSyxFQUFFLEtBQUs7SUFFWixJQUFJLEVBQUU7UUFDRjtZQUNJLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE1BQU0sRUFBRSxhQUFhO1lBQ3JCLGFBQWEsRUFBRSxtQ0FBbUM7WUFDbEQsU0FBUyxFQUFFLEtBQUs7WUFDaEIsVUFBVSxFQUFFLEtBQUs7U0FDcEI7S0FDSjtJQUVELFVBQVUsRUFBRTtRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osTUFBTSxFQUFFLENBQUM7S0FDWjtJQUVLLE9BQU8sQ0FBQyxNQUFZLEVBQUUsRUFBRSxXQUFXLEVBQXdDLEVBQUUsTUFBYzs7WUFDN0YsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sQ0FBQztZQUM1QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDZCxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO2dCQUMzQixNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQTtnQkFDcEIsRUFBRSxHQUFHLEtBQUssQ0FBQzthQUNkO1lBRUQsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO2dCQUMzQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ2QsS0FBSyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsQ0FBQyxJQUFJLFFBQVEsRUFB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