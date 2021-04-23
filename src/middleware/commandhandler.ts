import colors from "colors";
colors.enable();

import { Client, Collection, GuildMember, User } from "discord.js";
import fs from "fs";
import { ICommands, Iresponse } from "../interfaces";
import settings from "../../settings.json";
import { defaultErr, getChannel, getCommand, getMember, getRole, getUser } from "./modules";
const options = settings.Options;

export async function getCommands(client: Client) {
    client.commands = new Collection();
    let conn = client.conn;
    try {
        // get folders.
        let folders = await fs.readdirSync("./src/commands/");
        // Loop through folders.
        for (const folder of folders) {
            // Get all files in folder.
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"));
            // Loop through files.
            for (const file of commandFiles) {
                // Get file.
                const command = await import(`../commands/${folder}/${file}`) as ICommands;
                if (command == undefined) { continue };

                // search for commands with same name.
                let cmd = getCommand(client, command.name);

                // throw err.
                if (cmd !== undefined) {
                    console.log(`duplicate commands with name: ${command.name}`.red.bold);
                    process.exit();
                }

                // loop through arguments.
                for (const type in command.args) {
                    let x;
                    // set int of type;
                    switch (command.args[type].type) {
                        case "string": x = 3; break;
                        case "integer": x = 4; break;
                        case "boolean": x = 5; break;
                        case "user": x = 6; break;
                        case "channel": x = 7; break;
                        case "role": x = 8; break;
                        default: {
                            console.log(`${command.args[type].type} is an invalid arg type at ${command.name}`.red.bold);
                            process.exit();
                        }
                    }
                    command.args[type].type = x
                }
                // Get command from db.
                let query = await conn.query("SELECT * FROM Commands WHERE Name = ?", command.name);
                query = query[0];

                if (query === undefined && command.slash) {
                    client.api.applications(client.user.id).commands.post({
                        data: {
                            name: command.name,
                            description: command.description,
                            options: command.args
                        }
                    });
                    console.log(`${command.name} has been added as slash command.`)
                }

                // Insert command into db if not there yet.
                await conn.query("INSERT IGNORE INTO Commands (Name, Disabled, `Group`) VALUES (?,?,?)", [command.name, false, command.group]).catch((error) => {
                    console.error(error);
                });
                // Set disable status of command.
                command.disabled = query?.Disabled ? true : false;
                // Add command to client.
                client.commands.set(command.name, command);
                // Log.
                console.log(" > Command added: ".magenta + `${command.disabled ? command.name.red : command.name.green}`);
            }
        }
    } catch (err) {
        throw err;
    }
}

export async function runCommand(user: GuildMember | User, commandName: string, args: string[], client: Client): Promise<Iresponse> {
    // Try to find the command.
    let command = getCommand(client, commandName);

    // Check if command exists.
    if (command === undefined) { return { type: "disabled", content: "command doesnt exist" } }

    // check if in guild.
    if (command.guildOnly && !("user" in user)) {
        // Return error.
        return { type: "content", content: "This command is limited to servers." }
    }

    let guild = "user" in user ? user.guild : undefined;

    // check if admin command.
    if (command.adminOnly && user.id !== options.owner) {
        // Return error.
        return { type: "disabled", content: "This command is only available for admins" }
    }

    // Check if command is disabled.
    if (command.disabled && user.id !== options.owner) {
        // Return error.
        return { type: "content", content: "This command is currently disabled." }
    }

    // Call fun if it doesnt have args.
    if (command.args === undefined) { return await command.execute(user, undefined, client); }

    let commandArgs = {};
    for (let index in command.args) {
        let value;
        let arg = command.args[index];
        let input = args[index];
        if (input === undefined && arg.required) {
            // Return error.
            return { type: "content", content: `Incorrect command usage, missing the ${arg.name} variable` }
        }

        // Checks which data type it is and converts it into the right one.
        switch (arg.type) {
            case 3: value = input; break;
            case 4: {
                value = Number(input);
                if (!Number.isFinite(value)) { return { type: "content", content: "Incorrect command usage, not an integer." } }
                break;
            }
            case 5: break;
            case 6: {
                if (guild === undefined) { value = await getUser(client, input); }
                else { value = await getMember(client, guild.id, input); }
                break;
            }
            case 7: {
                if (guild === undefined) { return defaultErr; }
                value = await getChannel(client, guild.id, input);
                break;
            }
            case 8: {
                if (guild === undefined) { return defaultErr; }
                value = getRole(client, guild.id, input);
                break;
            }
            default: throw "invalid type."
        }


        commandArgs[arg.name] = value
        continue;
    }

    return await command.execute(user, commandArgs, client);
}