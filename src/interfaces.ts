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

    args: {
        type: string | number;
        name: string;
        description: string;
        default: boolean | string;
        required: boolean;
    }[]

    throttling: {
        duration: number;
        usages: number;
    }

    default: ICommands;

    execute(member: GuildMember | User, args?: {}, client?: Client): Promise<Iresponse>;
}

export interface Iresponse {
    type: string;
    content: string | {}
}

export enum logType {
    good = "#559b0f",
    bad = "#F50303",
    neutral = "#b700ff"
}

export enum argType {
    string = 3,
    integer = 4,
    boolean = 5,
    user = 6,
    channel = 7,
    role = 8
}