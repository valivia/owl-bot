import { Client, GuildMember, Message } from "discord.js";
import settings from "../../settings.json";
import { runCommand } from "../middleware/commandhandler";

const options = settings.Options;

export const name = "message";

export default function message(client: Client) {

    return async (msg: Message): Promise<void> => {
        try {
            // Check if valid channel.
            if (msg.guild === null && msg.channel === null) { return; }

            // Check if user is not a bot.
            if (msg.author.bot) { return; }

            // Check if bot is called with prefix or tag.
            if (!msg.content.startsWith(options.prefix, 0) &&
                !msg.content.startsWith(`<@!${client.user?.id}>`) &&
                !msg.content.startsWith(`<@&${client.user?.id}>`) &&
                msg.channel.type !== "dm") { return; }

            const user = msg.member == undefined ? msg.author : msg.member as GuildMember;

            // Return if cal.
            if (msg.author.id === "367750323860799508") return;

            let content = msg.content;
            // Check which way the bot got called.
            if (content.startsWith(options.prefix)) {
                // Cut off the prefix.
                content = content.slice(options.prefix.length);
            } else if (content.slice(0, 22) === `<@!${client.user?.id}>` || content.slice(0, 22) === `<@&${client.user?.id}>`) {
                // Cut off the ping.
                content = content.slice(22);
            }
            // Trim string.
            content = content.trim();
            // Check if there is a command.
            if (content.length === 0) { return; }
            // Split message into arguments.
            const args: string[] = content.trim().split(/ +/) || [];
            // Get command name.
            const commandName = args.shift()?.toLowerCase();

            if (!commandName) return;

            // Loop through arguments and pick out the mentions
            for (let i = 0; i < args.length; i++) {
                let matches = undefined;
                matches = args[i].match(/^(<(@|#)(!|&)?(\d+)>)$/);
                if (matches === null) { continue; }

                // replace arg with number.
                args[i] = matches[4];
            }

            // yeet through command handler.
            const response = await runCommand(user, commandName, args, client, msg);

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