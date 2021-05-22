import { Client, Guild, GuildChannel, GuildMember, Role, User } from "discord.js";
import { ICommands } from "../interfaces";
import axios from "axios";
import { Rcon } from "rcon-client/lib";
import settings from "../../settings.json"

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

export async function getName(uuid: string) {
    let userName = false;
    await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
        .then(response => {
            userName = response.status === 200 ? response.data.name : false;
        })
    return userName;
}

export async function subLoop(client: Client) {
    const db = client.conn;
    // Get guild.
    const guild = await getGuild(client, "823993381591711786");
    // Get all guild members.
    const members = await guild?.members.fetch();
    // Return if error.
    if (members === undefined) { return; }

    // Get from db.
    const users = await db.whitelist.findMany({ where: { Permanent: false } });

    // rcon connect.
    const rcon = await Rcon.connect({ host: settings.rcon.host, port: settings.rcon.port, password: settings.rcon.pass });

    for (let user of users) {
        // Get guild members.
        let member: GuildMember = await members.find(({ id }: { id: string }) => id === user.UserID);
        // Check if sub.
        const isSub = member.roles.cache.has("841690912748208158");

        // Skip if nothing changed.
        if ((!isSub && user.Expired) || (isSub && !user.Expired)) {
            continue;
        }
        // Whitelist if sub again.
        if (isSub && user.Expired) {
            user.Expired = false
            console.log(`Added ${member.user.tag} - ${member.id} to the whitelist`)
        } else {
            // Remove whitelist.
            user.Expired = true;
            console.log(`Removed ${member.user.tag} - ${member.id} from the whitelist`)
        }

        // Get mc name.
        const username = await getName(user.UUID);
        // Check if successfull.
        if (!username) { console.log(`COULDNT FIND USER ${user.UUID}`); continue; }
        // Try to whitelist.
        const response = await rcon.send(`whitelist ${user.Expired ? "remove" : "add"} ${username}`);
        // Log.
        console.log(response);

        // push to db.
        await db.whitelist.update({ where: { UserID: user.UserID }, data: { Expired: user.Expired } })
        continue;
    }
    // End connection.
    rcon.end();
}