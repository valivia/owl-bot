import { OwlClient } from "../types/classes";

export default function ready() {

    return async (client: OwlClient): Promise<void> => {
        if (!client.user) return;
        await client.user.setActivity(`for ${client.guilds.cache.size} servers`, {
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        });
    };
}