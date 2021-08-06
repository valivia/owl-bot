import { OwlClient } from "../types/classes";
import fs from "fs";
import path from "path";

export default (client: OwlClient): void => {
    console.log(" > Loading events".green.bold);
    const dir = path.join(__dirname, "../");
    fs.promises
        .readdir(`${dir}/events/`)
        .then(async (files) => {
            // Loop through files.
            for await (const file of files) {
                // Check if its a .js file.
                if (!file.endsWith(".js")) continue;
                // Import the file.
                await import(`${dir}/events/${file}`).then(async (module) => {
                    const Event = new module.default(client);
                    const name = file.split(".", 1)[0];
                    client.on(name, Event);
                    console.log(` - Loaded Event: ${name}`.cyan.italic);
                });
            }
        }).then(() => { console.log(" ✓ All Events loaded".green.bold); });
};