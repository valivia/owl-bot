import { PermissionResolvable, MessageEmbed } from "discord.js"

export type CommandInfo = {
    name: string;
    aliases: string[];
    description: string;
    example: string;
    group: string;

    guildOnly: boolean;
    adminOnly: boolean;
    disabled?: boolean;
    slash: boolean;

    args?: Argument[];

    permissions?: Permissions;

    throttling: Throttling;
}

export type Argument = {
    type: string | number;
    name: string;
    description: string;
    default: boolean | string;
    required: boolean;
}

export type Permissions = {
    self?: PermissionResolvable[]
    user?: PermissionResolvable[]
}

export type Throttling = {
    duration: number;
    usages: number;
}

export type MsgResponse = {
    type: string;
    content: string | MessageEmbed;
    callback?: boolean;
}

export type Whitelist = {
    type: string;
    UUID: string;
}

// eslint-disable-next-line no-shadow
export enum whitelistType {
    add = "whitelist add",
    del = "whitelist remove"
}

// eslint-disable-next-line no-shadow
export enum argType {
    string = 3,
    integer = 4,
    boolean = 5,
    user = 6,
    channel = 7,
    role = 8
}