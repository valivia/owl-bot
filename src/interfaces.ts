import { Client, GuildMember, Message, MessageEmbed, User } from "discord.js";

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

    execute(member: GuildMember | User, args?: Array<any>, client?: Client, msg?: Message): Promise<Iresponse>;
}

export interface Iresponse {
    type: string;
    content: string | MessageEmbed;
    callback?: boolean;
}

export interface IWhitelist {
    type: string;
    UUID: string;
}

export enum whitelistType {
    add = "whitelist add",
    del = "whitelist remove"
}

export enum argType {
    string = 3,
    integer = 4,
    boolean = 5,
    user = 6,
    channel = 7,
    role = 8
}