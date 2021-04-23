import { Client, GuildMember, Message } from "discord.js";
import settings from "../../settings.json";
import { runCommand } from "../middleware/commandhandler";

const options = settings.Options;

export const name = "message";

export default function message(client: Client) {

    return async (msg: Message) => {
        try {
            // Check if valid channel.
            if (msg.guild === null && msg.channel === null) { return; }

            // Check if user is not a bot.
            if (msg.author.bot) { return; };

            // Check if bot is called with prefix or tag.
            if (!msg.content.startsWith(options.prefix, 0) && !msg.content.startsWith(`<@!${client.user?.id}>`)) { return; }

            let user = msg.member == undefined ? msg.author : msg.member as GuildMember;
            
            // Split message into arguments.
            const args = msg.content.slice(options.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            // Loop through arguments and pick out the mentions
            for (let i = 0; i < args.length; i++) {
                let matches = undefined;
                matches = args[i].match(/^<@!?(\d+)>$/);
                if (matches == null) {
                    matches = args[i].match(/^<@&?(\d+)>$/)
                }
                if (matches == null) {
                    matches = args[i].match(/^<#?(\d+)>$/)
                }

                if (matches === null) { continue; }

                // replace arg with number.
                args[i] = matches[1];
            }

            // yeet through command handler.
            let response = await runCommand(user, commandName, args, client);
            if (response.type === "disabled") {
                return;
            }
            msg.channel.send(response.content);

        } catch (error) {
            console.error(error);
            return;
        }
    };
}