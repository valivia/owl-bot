import { Client, Message } from "discord.js";
import settings from "../../settings.json";
import { runCommand } from "../middleware/commandhandler";

const options = settings.Options;

export const name =  "message";

export default function message(client: Client) {

    return async (msg: Message) => {
        try {
            // Check if valid channel.
            if (msg.guild === null && msg.channel === null) { return; }

            // Check if user is not a bot.
            if (msg.author.bot) { return; };

            // Check if bot is called with prefix or tag.
            if (!msg.content.startsWith(options.prefix, 0) && !msg.content.startsWith(`<@!${client.user?.id}>`)) { return; }

            // yeet through command handler.
            runCommand(client, msg);

        } catch (error) {
            console.error(error);
            return;
        }
    };
}