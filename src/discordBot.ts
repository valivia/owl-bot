import colors from "colors";
import dotenv from "dotenv";
colors.enable();
dotenv.config();

import discord, { Intents } from "discord.js";
import { PrismaClient } from ".prisma/client";
import { OwlClient } from "./types/classes";
import { registerCommands } from "./modules/commandRegister";
import eventLoader from "./modules/eventLoader";
import { initLog } from "./middleware/logHandler";

class DiscordBot {
    private db: PrismaClient;
    private client: OwlClient;

    constructor() {
        this.client = new discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }) as OwlClient;

        this.initializeDB();
        this.initializeEvents();
        this.initializeCommands();
        initLog(this.client);
    }

    private initializeDB() {
        this.db = new PrismaClient();
        this.client.db = this.db;
    }

    private initializeEvents() {
        eventLoader(this.client);
    }

    private initializeCommands() {
        registerCommands(this.client).catch(() => { throw " x Couldnt load commands".red.bold; });
    }

    public async listen(): Promise<void> {
        const client = this.client;
        await client.login(process.env.BOT_TOKEN);
        if (!client.user) return;
        console.log(` ✓ OwlClient ready, logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`.green.bold);
    }
}

export default DiscordBot;