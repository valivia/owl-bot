import colors from "colors";
colors.enable();

import { Client, Collection, Message } from "discord.js";
import fs from "fs";
import { ICommands } from "../interfaces";
import settings from "../../settings.json";
const options = settings.Options;

export async function getCommands(client: Client) {
    client.commands = new Collection();
    fs.readdir(`./src/commands/`, async (err, folders) => {
        if (err) { console.log(`${err}`.red); }
        // Loop through folders.
        for (const folder of folders) {
            // Get all files in folder.
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"));
            // Loop through files.
            for (const file of commandFiles) {
                // Get file.
                const command = await import(`../commands/${folder}/${file}`) as ICommands;
                // Insert command into db if not there yet.
                await client.db.run("INSERT OR IGNORE INTO Commands (Name, Disabled, `Group`) VALUES (?,?,?)", [command.name, 0, command.group]).catch((error) => {
                    console.error(error);
                });
                // Get command from db.
                let query = await client.db.get("SELECT * FROM Commands WHERE Name = ?", command.name);
                // Set disable status of command.
                command.disabled = query.Disabled == 1 ? true : false;
                // Add command to client.
                client.commands.set(command.name, command);
                console.log(" > Command added: ".magenta + `${command.disabled ? command.name.red : command.name.green}`);
            }
        }
    });
}

export async function runCommand(client: Client, msg: Message,) {
    // Split message into arguments.
    const args = msg.content.slice(options.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Loop through arguments and pick out the mentions
    for (let i = 0; i < args.length; i++) {
        const matches = args[i].match(/^<@!?(\d+)>$/);

        if (matches === null) { continue; }

        args[i] = client.users.cache.get(matches[1]);
    }

    // Try to find the command.
    let cmd = client.commands.get(commandName) as ICommands
    let cmdAlias = client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)) as ICommands 
    // Define command.
    const command = cmdAlias !== undefined ? cmdAlias: ( cmd !== undefined ? cmd : undefined );

    // Check if command exists.
    if (command === undefined) { return; }

    // Check if command is disabled.
    if (command.disabled && msg.author.id !== options.owner) { return; }

    // check if admin command.
    if (command.adminOnly && msg.author.id !== options.owner) { return; }

    // check if in guild.
    if (command.guildOnly && msg.channel.type !== "dm") {
        msg.reply("This command is limited to servers.");

        return;
    }

    // check if argument is required.
    if (command.required && args.length < 1) {
        let reply = `You didn't provide any arguments, ${msg.author}!`;

        if (command.example !== undefined) {
            reply += `\nThe proper usage would be: \`${options.prefix}${command.name} ${command.example}\``;
        }

        msg.channel.send(reply);
        return;
    }

    command.execute(msg, args, client.db)
    return;
}