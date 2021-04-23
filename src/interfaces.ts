import { Client, GuildMember, User } from "discord.js";

export interface ICommands {
    name: string;
    aliases: string[];
    description: string;
    example: string;
    group: string;

    guildOnly: boolean;
    adminOnly: boolean;
    disabled?: boolean;
    slash: boolean;

    args: Iarguments[];

    throttling: Ithrottling;

    execute(member: GuildMember | User, args?: {}, client?: Client): Promise <Iresponse>;
}

export interface Iarguments {
    type: string | number;
    name: string;
    description: string;
    default: boolean | string;
    required: boolean;
}
export interface Ithrottling {
    duration: number;
    usages: number;
}
export interface Iresponse {
    type: string;
    content: string | {}
}