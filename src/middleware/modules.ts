import { Client, Guild, GuildMember, User } from "discord.js";

export async function getUser(client: Client, userID: string): Promise<User | undefined> {
    let user;
    user = client.users.cache.get(userID)
    if (user === undefined) {
        user = await client.users.fetch(userID)
    }
    return user;
}

export async function getGuild(client: Client, guildID: string): Promise<Guild | undefined> {
    let guild;
    guild = client.guilds.cache.get(guildID)
    if (guild === undefined) {
        guild = await client.guilds.fetch(guildID)
    }
    return guild;
}

export async function getMember(client: Client, guildID: string, userID: string): Promise<GuildMember | undefined> {
    let guild = await getGuild(client, guildID)
    if (guild === undefined) { return undefined; }

    let member;
    member = guild.members.cache.get(userID)
    if (member === undefined) {
        member = await guild.members.fetch(userID)
    }
    return member;
}
export let defaultErr = { type: "text", content: "an error occured" };