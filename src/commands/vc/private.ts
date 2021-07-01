import { GuildMember } from "discord.js";
import { defaultErr } from "../../middleware/modules";
import { Command, OwlClient } from "../../types/classes";
import { MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "private",
            aliases: [""],
            description: "toggles privacy",
            example: "",
            group: "vc",

            guildOnly: true,
            adminOnly: false,
            slash: false,

            throttling: {
                duration: 30,
                usages: 3,
            },
        });
    }

    async run(_author: GuildMember): Promise<MsgResponse> {
        try {
            return defaultErr;
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};
