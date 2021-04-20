import colors from "colors";
colors.enable();

import discord from "discord.js";
import * as sqlite from "sqlite";
import settings from "../settings.json";
import fs from "fs";

import { getCommands } from "./middleware/commandhandler";
import { fetchChannel } from "./middleware/logHandler"

export default function discordBot(db: sqlite.Database) {

    const client = new discord.Client();

    // EVENTS

    client
        .on("ready", async () => {
            if (client.user === null) { return; }
            // setTimeout(loop, 1000);
            client.db = db;
            await client.user.setActivity(`for ${client.guilds.cache.size} servers`, {
                type: "STREAMING",
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            });

            // initiate command list.
            getCommands(client);
            // initiate logHandler.
            fetchChannel(client);
            // Initiate events.
            fs.promises
            .readdir('./src/events/')
            .then(async (files) => {
                // Loop through files.
                for await (const file of files) {
                    // Check if its a .js file.
                    if (!file.endsWith('.js')) continue;
                    // Import the file.
                    await import(`./events/${file}`).then(async (module) => {
                        const Event = new module.default(client);
                        client.on(module.name, Event);
                        console.log(" > event added: ".magenta + module.name.green);
                    });
                }
            })

            console.log(` > Client ready, logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`.magenta);
        })
        .on("disconnect", () => {
            console.warn("Disconnected!");
            process.exit();
        })

    async function loop() {
        console.log(" > Running loop . . .".yellow);
        // loop.
        setTimeout(loop, 300000);
    }

    client.login(settings.Bot.Token);

    return client;
}