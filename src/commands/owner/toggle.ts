import { Client, GuildMember } from "discord.js";
import { argType, Iresponse } from "../../interfaces";
import { defaultErr, getCommand } from "../../middleware/modules";

module.exports = {
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

    async execute(_author: GuildMember, { commandName }: { commandName: string }, client: Client): Promise<Iresponse> {
        if (commandName === undefined) return defaultErr;
        const conn = client.conn;
        try {
            const command = getCommand(client, commandName);

            if (command === undefined) return { type: "text", content: "This command doesnt exist." };

            await conn.commands.update({ data: { Disabled: (command.disabled ? false : true) }, where: { Name: commandName } });

            command.disabled = !command.disabled;

            client.commands.set(command.name, command);

            return { type: "text", content: `command has been ${command.disabled ? "disabled" : "enabled"}.` };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};