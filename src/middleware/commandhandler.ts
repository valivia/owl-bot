import colors from "colors";
colors.enable();

import { Guild, GuildMember, Message, PermissionResolvable, User } from "discord.js";
import { Command, OwlClient } from "../types/classes";
import { Argument, MsgResponse } from "../types/types";
import { defaultErr, getChannel, getCommand, getMember, getRole } from "../modules/modules";
import "dotenv";
const env = process.env;


export async function runCommand(user: GuildMember | User | null, commandName: string, args: string[], client: OwlClient, msg?: Message): Promise<MsgResponse> {
    const command = getCommand(client, commandName);
    if (user === null) { return defaultErr; }
    if (command === undefined) { return { disabled: true, content: "command doesnt exist" }; }
    if (command.guildOnly && !("user" in user)) { return { content: "This command is limited to servers." }; }
    const guild = "user" in user ? user.guild : undefined;
    if (command.adminOnly && user.id !== env.OWNER) return { disabled: true, content: "This command is only available for admins" };
    if (command.disabled && user.id !== env.OWNER) return { content: "This command is currently disabled." };

    if (command.permissions !== undefined && guild) {
        user = user as GuildMember;
        if (command.permissions.user && !hasPerms(command.permissions.user, user)) {
            return { disabled: true, content: "You dont have the permissions to do that." };
        }
        if (!user.guild.me) return defaultErr;
        if (command.permissions.self && !hasPerms(command.permissions.self, user.guild.me)) {
            return { content: "The bot doesnt have the right permissions for this." };
        }
    }

    // Call function if it doesnt have args.
    if (command.args === undefined) { return await command.run(user, undefined, client); }

    const commandArgs = await argumenthanlder(command, args, client, guild);

    if (commandArgs.type !== undefined) return commandArgs as MsgResponse;

    return await command.run(user, commandArgs, client, msg);
}

function hasPerms(required: PermissionResolvable[], member: GuildMember): boolean {
    for (const perm of required) {
        if (!member.permissions.has(perm)) return false;
    }
    return true;
}

async function argumenthanlder(command: Command, args: string[], client: OwlClient, guild: Guild | undefined): Promise<Record<string, unknown>> {
    const commandArgs: Record<string, unknown> = {};
    command.args = command.args as Argument[];
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
                if (!Number.isFinite(Number(input)) && arg.required) { return { type: "content", content: "Incorrect command usage, not an integer." }; }
                break;
            }
            case 5: break;
            case 6: {
                if (!(/[\d]/.test(input) && input.length == 18) && arg.required) {
                    console.log("bruh");
                    return { type: "content", content: "Couldnt find that user" };
                }
                if (guild === undefined) {
                    value = await client.users.fetch(input);
                    break;
                } else value = await getMember(client, guild.id, input);
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