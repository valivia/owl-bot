import { Client, GuildChannel, GuildMember, Role } from "discord.js";
import { ICommands, IWhitelist, whitelistType } from "../interfaces";
import axios from "axios";
import { Rcon } from "rcon-client/lib";
import settings from "../../settings.json";
import logHandler from "./logHandler";
import { Logs_Event } from "@prisma/client";

export async function getMember(client: Client, guildID: string, userID: string): Promise<GuildMember | null> {
    const guild = await client.guilds.fetch(guildID);
    if (guild === null) { return null; }

    let member;
    member = guild.members.resolve(userID);
    if (member === null) {
        member = await guild.members.fetch(userID);
    }
    return member;
}

export async function getChannel(client: Client, guildID: string, channelID: string): Promise<GuildChannel | null> {
    const guild = await client.guilds.fetch(guildID);
    if (guild === null) { return null; }

    const channel = guild.channels.resolve(channelID);

    return channel;
}

export async function getRole(client: Client, guildID: string, roleID: string): Promise<Role | null> {
    const guild = await client.guilds.fetch(guildID);
    if (guild === null) { return null; }

    let role;
    role = guild.roles.resolve(roleID);
    if (role === null) {
        role = guild.roles.fetch(roleID);
    }

    return role;
}

export function getCommand(client: Client, name: string): ICommands | undefined {
    const command = client.commands.get(name) as ICommands;
    const cmdAlias = client.commands.find((cmd: { aliases: string | string[]; }) => cmd.aliases && cmd.aliases.includes(name)) as ICommands;

    return cmdAlias !== undefined ? cmdAlias : (command !== undefined ? command : undefined);
}

export async function accountExists(username: string): Promise<boolean | string> {
    let code = false;
    await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`)
        .then(response => {
            code = response.status === 200 ? response.data.id : false;
        });
    return code;
}

export const defaultErr = { type: "text", content: "an error occured" };

export async function getName(uuid: string): Promise<string | false> {
    let userName = false;
    await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
        .then(response => {
            userName = response.status === 200 ? response.data.name : false;
        });
    return userName;
}

export async function subLoop(client: Client): Promise<void> {
    const db = client.conn;
    const guild = await client.guilds.fetch("823993381591711786");
    const members = await guild?.members.fetch();
    if (members === undefined) { return; }
    const users = await db.whitelist.findMany({ where: { Permanent: false } });
    const rconActions: IWhitelist[] = [];

    for (const user of users) {
        const member: GuildMember = await members.find(({ id }: { id: string }) => id === user.UserID);
        if (member === undefined) {
            user.Expired = true;
            console.log(`User left, removing from whitelist`);
            rconActions.push({ UUID: user.UUID, type: whitelistType.del });
            await db.whitelist.delete({ where: { UserID: user.UserID } });
            continue;
        }
        const isSub = member.roles.cache.has("841690912748208158");
        if ((!isSub && user.Expired) || (isSub && !user.Expired)) continue;
        if (isSub && user.Expired) {
            user.Expired = false;
            rconActions.push({ UUID: user.UUID, type: whitelistType.add });
            console.log(`Added ${member.user.tag} - ${member.id} to the whitelist`);
            logHandler(Logs_Event.Whitelist_Add, guild?.id as string, member.user, `Added ${member.user.tag} to the whitelist`);
        } else {
            user.Expired = true;
            rconActions.push({ UUID: user.UUID, type: whitelistType.del });
            logHandler(Logs_Event.Whitelist_Add, guild?.id as string, member.user, `Removed ${member.user.tag} from the whitelist`);
        }
        await db.whitelist.update({ where: { UserID: user.UserID }, data: { Expired: user.Expired } });
        continue;
    }

    whitelist(rconActions);
}

export async function whitelist(content: IWhitelist[]): Promise<void> {
    if (content.length == 0) return;
    const rcon = await Rcon.connect({ host: settings.rcon.host, port: settings.rcon.port, password: settings.rcon.pass })
        .catch();
    for (const user of content) {
        const username = await getName(user.UUID);
        if (!username) {
            console.log(`COULDNT FIND USER ${user.UUID}`);
            continue;
        }
        const response = await rcon.send(`${user.type} ${username}`);
        console.log(response);
    }
    rcon.end();
}