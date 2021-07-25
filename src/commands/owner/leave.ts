import { GuildMember } from "discord.js";
import { Command, OwlClient } from "../../types/classes";
import { MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "removeguild",
            aliases: [""],
            description: "Leave guild.",
            example: "",
            group: "owner",

            guildOnly: true,
            adminOnly: true,
            slash: false,

            throttling: {
                usages: 0,
                duration: 0,
            },
        });
    }

    async run(author: GuildMember, _undefined: undefined, _client: OwlClient): Promise<MsgResponse> {
        author.guild.leave();

        return { type: "disabled", content: "a" };
    }
};