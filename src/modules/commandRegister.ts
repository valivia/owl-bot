import { Collection } from "discord.js";
import { Command, OwlClient } from "../types/classes";
import { getCommand } from "./modules";
import fs from "fs";
import path from "path";

function argTypeValidator(command: Command) {
    if (!command.args) return;
    for (const arg of command.args) {
        const num = arg.type;
        if (num > 8 || num < 3 || !Number.isFinite(num)) {
            console.log(`${num} is an invalid arg type at ${command.name}`.red.bold);
            process.exit();
        }
    }
}

export async function registerCommands(client: OwlClient): Promise<void> {
    console.log(" > Loading commands".green.bold);
    client.commands = new Collection();
    const db = client.db;
    const folders = fs.readdirSync(path.join(__dirname, "../commands"));
    for (const folder of folders) {
        const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${folder}`)).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const cmdClass = (await import(`../commands/${folder}/${file}`)).default;
            const command = new cmdClass() as Command;

            if (command == undefined) { continue; }

            if (getCommand(client, command.name) !== undefined) {
                console.log(`duplicate commands with name: ${command.name}`.red.bold);
                process.exit();
            }

            argTypeValidator(command);

            // Get command from db.
            const query = await db.commands.findUnique({ where: { Name: command.name } });

            // Add to slash commands.
            /*
            if (query === null && command.slash) {
                client.api.applications(client.user?.id).commands.post({
                    data: {
                        name: command.name,
                        description: command.description,
                        options: command.args,
                    },
                });
                console.log(`${command.name} has been added as slash command.`);
            }*/

            // Insert command into db if not there yet.
            if (query === null) {
                await db.commands.create({
                    data: {
                        Name: command.name,
                        Disabled: false,
                        Info: JSON.stringify(command),
                    },
                });
            }

            // Set disable status of command.
            command.disabled = query?.Disabled ? true : false;
            // Add command to client.
            client.commands.set(command.name, command);
            // Log.
            console.log(`${" - Loaded Command:".cyan.italic} ${command.disabled ? command.name.red.italic : command.name.green.italic}`);
        }
    }
    console.log(" ✓ All commands loaded".green.bold);
}