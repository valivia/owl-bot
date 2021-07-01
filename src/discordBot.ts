import colors from "colors";
import dotenv from "dotenv";
colors.enable();
dotenv.config();

import fs from "fs";
import discord from "discord.js";
import "discord-reply";

import { runCommand } from "./middleware/commandhandler";
import { getMember } from "./middleware/modules";
import { PrismaClient } from ".prisma/client";
import { initLog } from "./middleware/logHandler";
import { OwlClient } from "./types/classes";
import { getCommands } from "./middleware/commandRegister";

export default function discordBot(db: PrismaClient): OwlClient {

    const client = new discord.Client() as OwlClient;

    // EVENTS

    client
        .on("ready", async () => {
            if (client.user === null) { return; }
            // setTimeout(loop, 1000);
            client.db = db;

            await client.user.setActivity(`for ${client.guilds.cache.size} servers`, {
                type: "STREAMING",
                url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            });

            // Init log
            initLog(client);
            // initiate command list.
            getCommands(client);
            // Initiate events.
            fs.promises
                .readdir("./src/events/")
                .then(async (files) => {
                    // Loop through files.
                    for await (const file of files) {
                        // Check if its a .js file.
                        if (!file.endsWith(".js")) continue;
                        // Import the file.
                        await import(`./events/${file}`).then(async (module) => {
                            const Event = new module.default(client);
                            const name = file.split(".", 1)[0];
                            client.on(name, Event);
                            console.log(" > event added: ".magenta + name.green);
                        });
                    }
                });

            console.log(` > OwlClient ready, logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`.magenta);

            // subLoop(client);

        })
        .on("disconnect", () => {
            console.warn("Disconnected!");
            process.exit();
        })
        // .on("debug", (e) => { console.debug(e) })
        .ws.on("INTERACTION_CREATE", async interaction => {
            // console.log(interaction);
            const args = [];
            // loop through arguments.
            for (const index in interaction.data.options) {
                // push argument into list.
                args.push(interaction.data.options[index].value);
            }

            let user;
            const userID = interaction.member !== undefined ? interaction.member.user.id : interaction.user.id;

            // Check if executed from guild.
            if (interaction.guild_id !== undefined) user = await getMember(client, interaction.guild_id, userID);
            else user = await client.users.fetch(userID);

            // Execute command.
            const response = user !== undefined ? await runCommand(user, interaction.data.name, args, client) : { type: "content", content: "an error occured" };

            let data;
            if (response.type == "embed") {
                data = {
                    type: 4,
                    embeds: [response.content],
                };
            } else {
                data = {
                    type: 4,
                    content: response.content !== undefined ? response.content : "an error occured",
                };
            }
            // Respond.
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: { type: 4, data },
            });
        });

    client.login(process.env.BOT_TOKEN);

    return client;
}


/*
            client.guilds.cache.each(async (a: Guild) => {
                console.log(a.name);
                await client.db.settings.create({ data: { GuildID: a.id } });
            });
            */