import { Message, User } from "discord.js";
import { Connection } from "mariadb";
module.exports = {
    name: "transfer",

    aliases: [""],
    description: "trasnfer ownership",
    examples: [""],
    group: "vc",
    guildOnly: true,
    required: true,

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(msg: Message, args: object[], conn: Connection) {
        try {
            const pingedUser = args[0] as User;
            let userChannel = await conn.query("SELECT * FROM `VoiceChannels` WHERE `UserID` = ?", msg.author.id)
            // Check if user has a vc.
            if (userChannel == undefined) {
                return msg.reply("You dont have an active private voicechat")
            }

            if (msg.guild?.members.cache.get(pingedUser.id)) {

                // Make vc private.
                await conn.query("UPDATE `VoiceChannels` SET Open = 0 WHERE `UserID` = ?", msg.author.id);
            }
            return;
        } catch (e) {
            console.log(e);
            return msg.reply("an error occured");
        }
    },
};
