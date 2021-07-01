import colors from "colors";
colors.enable();

import { Collection, Guild, GuildMember, Message, PermissionResolvable, User } from "discord.js";
import fs from "fs";
import settings from "../../settings.json";
import { Command, OwlClient } from "../types/classes";
import { MsgResponse } from "../types/types";
import { defaultErr, getChannel, getCommand, getMember, getRole } from "./modules";
const options = settings.Options;


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

export async function getCommands(client: OwlClient): Promise<void> {
    client.commands = new Collection();
    const db = client.db;
    const folders = fs.readdirSync("./src/commands/");
    for (const folder of folders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"));
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
            if (query === null && command.slash) {
                client.api.applications(client.user?.id).commands.post({
                    data: {
                        name: command.name,
                        description: command.description,
                        options: command.args,
                    },
                });
                console.log(`${command.name} has been added as slash command.`);
            }

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
            console.log(" > Command added: ".magenta + `${command.disabled ? command.name.red : command.name.green}`);
        }
    }
}

export async function runCommand(user: GuildMember | User | null, commandName: string, args: string[], client: OwlClient, msg?: Message): Promise<MsgResponse> {
    const command = getCommand(client, commandName);
    if (user === null) { return defaultErr; }
    if (command === undefined) { return { type: "disabled", content: "command doesnt exist" }; }
    if (command.guildOnly && !("user" in user)) { return { type: "content", content: "This command is limited to servers." }; }
    const guild = "user" in user ? user.guild : undefined;
    if (command.adminOnly && user.id !== options.owner) return { type: "disabled", content: "This command is only available for admins" };
    if (command.disabled && user.id !== options.owner) return { type: "content", content: "This command is currently disabled." };

    if (command.permissions !== undefined && guild) {
        user = user as GuildMember;
        if (command.permissions.user && !hasPerms(command.permissions.user, user)) {
            return { type: "disabled", content: "You dont have the permissions to do that." };
        }
        if (!user.guild.me) return defaultErr;
        if (command.permissions.self && !hasPerms(command.permissions.self, user.guild.me)) {
            return { type: "content", content: "The bot doesnt have the right permissions for this." };
        }
    }

    // Call function if it doesnt have args.
    if (command.args === undefined) { return await command.run(user, undefined, client); }

    const commandArgs = await argumenthanlder(command, args, client, guild);

    return await command.run(user, commandArgs, client, msg);
}

function hasPerms(required: PermissionResolvable[], member: GuildMember): boolean {
    for (const perm of required) {
        if (!member.hasPermission(perm)) return false;
    }
    return true;
}

async function argumenthanlder(command: Command, args: string[], client: OwlClient, guild: Guild | undefined): Promise<any> {
    const commandArgs: Record<string, unknown> = {};
    if (command.args === undefined) return null;
    for (let index = 0; index < command.args?.length; index++) {
        let value;
        const arg = command.args[index];
        let input = args[index];
        if (input === undefined && arg.required) return { type: "content", content: `Incorrect command usage, missing the ${arg.name} variable` };

        // Adds remaining text if possible.
        if (command.args.length < args.length && Number(index) + 1 == command.args.length && arg.type == 3) {
            input = args.slice(Number(index), args.length).join(" ");
        }

        // Checks which data type it is and converts it into the right one.
        switch (arg.type) {
            case 3: value = input; break;
            case 4: {
                value = Number(input);
                if (!Number.isFinite(value)) { return { type: "content", content: "Incorrect command usage, not an integer." }; }
                break;
            }
            case 5: break;
            case 6: {
                if (guild === undefined) value = await client.users.fetch(input);
                else value = await getMember(client, guild.id, input);
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
            default: throw "invalid type.";
        }


        commandArgs[arg.name] = value;
        continue;
    }
    return commandArgs;
}