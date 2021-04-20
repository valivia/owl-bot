import { Message } from "discord.js";
import { Database } from "sqlite";

export interface ICommands {
    adminOnly: boolean;
    aliases: string[];
    name: string;
    required: boolean;
    example: string;
    guildOnly: boolean;
    group: string;
    description: string;
    throttling: Ithrottling;
    disabled?: boolean;
    execute(msg: Message, args?: String[], db?: Database): boolean;
}
export interface Ithrottling {
    duration: number;
    usages: number;
}