import colors from "colors";
colors.enable();

import fs from "fs";
import discord from "discord.js";

import settings from "../settings.json";
import { getCommands, runCommand } from "./middleware/commandhandler";
import { getMember, getUser, subLoop } from "./middleware/modules";
import { fetchChannel } from "./middleware/logHandler"
import { PrismaClient } from ".prisma/client";

export default function discordBot(db: PrismaClient) {

    const client = new discord.Client();

    // EVENTS

    client
        .on("ready", async () => {
            if (client.user === null) { return; }
            // setTimeout(loop, 1000);
            client.conn = db;
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

            subLoop(client);

        })
        .on("disconnect", () => {
            console.warn("Disconnected!");
            process.exit();
        })
        //.on("debug", (e) => { console.debug(e) })
        .ws.on("INTERACTION_CREATE", async interaction => {
            // console.log(interaction);
            let args = []
            // loop through arguments.
            for (let index in interaction.data.options) {
                // push argument into list.
                args.push(interaction.data.options[index].value)
            }

            let user;
            let userID = interaction.member !== undefined ? interaction.member.user.id : interaction.user.id;

            // Return if cal.
            if (userID === "367750323860799508") return;

            // Check if executed from guild.
            if (interaction.guild_id !== undefined) {
                // get member.
                user = await getMember(client, interaction.guild_id, userID);
            } else {
                // Get user.
                user = await getUser(client, userID);
            }

            // Execute command.
            let response = user !== undefined ? await runCommand(user, interaction.data.name, args, client) : { type: "content", content: "an error occured" };

            let data;
            if (response.type == "embed") {
                data = {
                    type: 4,
                    embeds: [response.content]
                }
            } else {
                data = {
                    type: 4,
                    content: response.content !== undefined ? response.content : "an error occured"
                }
            }
            // Respond.
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: { type: 4, data }
            })
        })

    client.login(settings.Bot.Token);

    return client;
}
