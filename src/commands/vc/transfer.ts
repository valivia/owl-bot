import { GuildMember } from "discord.js";
import { defaultErr } from "../../modules/modules";
import { Command, OwlClient } from "../../types/classes";
import { MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "transfer",

            aliases: [""],
            description: "transfer ownership",
            example: "",
            group: "vc",
            guildOnly: true,
            adminOnly: false,
            slash: false,

            throttling: {
                duration: 30,
                usages: 1,
            },
        });
    }

    async run(_author: GuildMember): Promise<MsgResponse> {
        try {
            /*
            const pingedUser = args[0] as User;
            const userChannel = await db.query("SELECT * FROM `VoiceChannels` WHERE `UserID` = ?", msg.author.id);
            // Check if user has a vc.
            if (userChannel == undefined) {
                return msg.reply("You dont have an active private voicechat");
            }

            if (msg.guild?.members.cache.get(pingedUser.id)) {

                // Make vc private.
                await db.query("UPDATE `VoiceChannels` SET Open = 0 WHERE `UserID` = ?", msg.author.id);
            }*/
            return defaultErr;
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};
