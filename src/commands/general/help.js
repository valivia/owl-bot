"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const settings_json_1 = require("../../../settings.json");
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
    execute(msg, args) {
        const { commands } = msg.client;
        console.log(commands);
        if (args.length < 1) {
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
            return msg.author.send(list)
                .then(() => {
                if (msg.channel.type === "dm") {
                    return;
                }
                msg.react("709511914962681888");
            })
                .catch(error => {
                console.error(`Could not send help DM to ${msg.author.tag}.\n`, error);
                msg.reply("cannot send a DM.");
            });
        }
        const cmdName = args[0].toLowerCase();
        const command = commands.get(cmdName) || commands.find(c => c.aliases && c.aliases.includes(cmdName));
        if (command === undefined) {
            return msg.reply("Invalid command");
        }
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor(msg.author.username, `${msg.author.avatarURL()}`)
            .setTitle(command.name)
            .addField("Description", command.description !== undefined ? command.description : "-")
            .addField("Aliases", command.aliases.length < 1 ? command.aliases.join(", ") : "No Aliases available for this command.", true)
            .addField("Example", command.example !== undefined ? `\`\`${settings_json_1.Options.prefix}${command.name} ${command.example}\`\`` : "No example provided.", true)
            .addField("cooldown", command.throttling !== undefined ? command.throttling.duration : "none")
            .setColor("#FF0000")
            .setTimestamp();
        return msg.channel.send(embed);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlbHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBbUQ7QUFDbkQsMERBQWlEO0FBR2pELE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixJQUFJLEVBQUUsTUFBTTtJQUVaLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztJQUNkLFdBQVcsRUFBRSwrQkFBK0I7SUFDNUMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ2QsS0FBSyxFQUFFLFNBQVM7SUFDaEIsVUFBVSxFQUFFO1FBQ1IsUUFBUSxFQUFFLEVBQUU7UUFDWixNQUFNLEVBQUUsQ0FBQztLQUNaO0lBRUQsT0FBTyxDQUFDLEdBQVksRUFBRSxJQUFjO1FBQ2hDLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdEIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNqQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxLQUFLLE1BQU0sQ0FBRSxBQUFELEVBQUcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUUsSUFBSSxRQUFRLEVBQUU7Z0JBQUUsSUFBSSxJQUFJLE9BQU8sSUFBSSxPQUFPLFdBQVcsRUFBRSxDQUFDO2FBQUU7WUFDaEcsTUFBTSxJQUFJLEdBQUcsSUFBSSx5QkFBWSxFQUFFO2lCQUM5QixRQUFRLENBQUMsb0JBQW9CLENBQUM7aUJBQzlCLFNBQVMsQ0FDTixFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLEVBQ3hDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQ3RDO2lCQUNBLFFBQVEsQ0FBQyxZQUFZLEVBQUUsUUFBUSx1QkFBTyxDQUFDLE1BQU0scURBQXFELENBQUM7aUJBQ25H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