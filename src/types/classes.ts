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
    commands!: OwlCollection<string, Command>;
    db!: PrismaClient;
}

export class OwlCollection<K, V> extends Collection<K, V> {
    public each(fn: (value: V, key: K, collection: this) => void): this;
    public each<T>(fn: (this: T, value: V, key: K, collection: this) => void, thisArg: T): this;
    public each(fn: (value: V, key: K, collection: this) => void, thisArg?: unknown): this {
        this.forEach(fn as (value: V, key: K, map: Map<K, V>) => void, thisArg);
        return this;
    }
    public map<T>(fn: (value: V, key: K, collection: this) => T): T[];
    public map<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): T[];
    public map<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): T[] {
        if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
        const iter = this.entries();
        return Array.from({ length: this.size }, (): T => {
            const [key, value] = iter.next().value;
            return fn(value, key, this);
        });
    }
}