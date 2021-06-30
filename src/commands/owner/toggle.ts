import { GuildMember } from "discord.js";
import { defaultErr, getCommand } from "../../middleware/modules";
import { Command, OwlClient } from "../../types/classes";
import { argType, MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "toggle",
            aliases: [""],
            description: "toggles a command",
            example: "join",
            group: "owner",

            guildOnly: false,
            adminOnly: true,
            slash: false,

            args: [
                {
                    "type": argType.string,
                    "name": "commandName",
                    "description": "command to toggle.",
                    "default": false,
                    "required": true,
                },
            ],

            throttling: {
                duration: 30,
                usages: 3,
            },
        });
    }

    async run(_author: GuildMember, { commandName }: { commandName: string }, client: OwlClient): Promise<MsgResponse> {
        if (commandName === undefined) return defaultErr;
        const db = client.db;
        try {
            const command = getCommand(client, commandName);

            if (command === undefined) return { type: "text", content: "This command doesnt exist." };

            await db.commands.update({ data: { Disabled: (command.disabled ? false : true) }, where: { Name: commandName } });

            command.disabled = !command.disabled;

            client.commands.set(command.name, command);

            console.log(` > ${command.disabled ? "disabled" : "enabled"}: `.magenta + command.name.green);
            return { type: "text", content: `command has been ${command.disabled ? "disabled" : "enabled"}.` };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};