import { Client, Guild, GuildChannel, GuildMember, Role, User } from "discord.js";
import { ICommands } from "../interfaces";
import axios from "axios";

export async function getUser(client: Client, userID: string): Promise<User | null> {
    let user;
    user = client.users.resolve(userID)
    if (user === null) {
        user = await client.users.fetch(userID)
    }
    return user;
}

export async function getGuild(client: Client, guildID: string): Promise<Guild | null> {
    let guild;
    guild = client.guilds.resolve(guildID)
    if (guild === null) {
        guild = await client.guilds.fetch(guildID)
    }
    return guild;
}

export async function getMember(client: Client, guildID: string, userID: string): Promise<GuildMember | null> {
    let guild = await getGuild(client, guildID)
    if (guild === null) { return null; }

    let member;
    member = guild.members.resolve(userID)
    if (member === null) {
        member = await guild.members.fetch(userID)
    }
    return member;
}

export async function getChannel(client: Client, guildID: string, channelID: string): Promise<GuildChannel | null> {
    let guild = await getGuild(client, guildID)
    if (guild === null) { return null; }

    let channel;
    channel = guild.channels.resolve(channelID);

    return channel;
}

export async function getRole(client: Client, guildID: string, roleID: string): Promise<Role | null> {
    let guild = await getGuild(client, guildID)
    if (guild === null) { return null; }

    let role;
    role = guild.roles.resolve(roleID);
    if (role === null) {
        role = guild.roles.fetch(roleID);
    }

    return role;
}

export function getCommand(client: Client, name: string) {
    let cmd = client.commands.get(name) as ICommands
    let cmdAlias = client.commands.find((cmd: { aliases: string | string[]; }) => cmd.aliases && cmd.aliases.includes(name)) as ICommands

    const command = cmdAlias !== undefined ? cmdAlias : (cmd !== undefined ? cmd : undefined);

    return command
}

export async function accountExists(username: string): Promise<boolean | string> {
    let code = false;
    await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`)
        .then(response => {
            code = response.status === 200 ? response.data.id : false;
        })
    return code;
}

export let defaultErr = { type: "text", content: "an error occured" };