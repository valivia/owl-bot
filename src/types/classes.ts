import { PrismaClient } from "@prisma/client";
import { GuildMember, User, Message, Collection, Client } from "discord.js";
import { Argument, CommandInfo, MsgResponse, Throttling } from "./types";

export abstract class Command {
    public constructor(public client: OwlClient, info: CommandInfo) {
        this.client = client;
        Object.assign(this, info);
    }

    public name!: string;
    public aliases: string[] | undefined;
    public description!: string;
    public example: string | undefined;
    public group!: string;

    public guildOnly = false;
    public adminOnly = false;
    public disabled?: boolean;
    public slash = false;

    public args?: Argument[];

    public permissions?: Permissions;

    public throttling!: Throttling;

    abstract run(member: GuildMember | User, args?: Record<string, unknown>, client?: OwlClient, msg?: Message): Promise<MsgResponse>;
}

export class OwlClient extends Client {
    commands!: Collection<string, Command>;
    conn!: PrismaClient;
}