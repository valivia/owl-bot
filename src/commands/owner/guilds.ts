import { GuildMember } from "discord.js";
import { Command, OwlClient } from "../../types/classes";
import { MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "guilds",
            aliases: [""],
            description: "show guilds.",
            example: "",
            group: "owner",

            guildOnly: false,
            adminOnly: true,
            slash: false,

            throttling: {
                usages: 0,
                duration: 0,
            },
        });
    }

    async run(_author: GuildMember, _undefined: undefined, client: OwlClient): Promise<MsgResponse> {
        const result = await client.guilds.cache.map((guild) => `${guild.name} - ${guild.id} - ${guild.ownerId}`).join("\n");

        return { content: result };
    }
};