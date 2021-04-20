import { Message } from "discord.js";
import { Database } from "sqlite";
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

    async execute(msg: Message, args: object[], db: Database) {
        const pingedUser: User = args[0];
        let userChannel = await db.get("SELECT * FROM `VoiceChannels` WHERE `UserID` = ?", msg.author.id)
        // Check if user has a vc.
        if (userChannel == undefined) {
            return msg.reply("You dont have an active private voicechat")
        }

        if (msg.guild?.members.cache.get(pingedUser.id))

        // Make vc private.
        await db.run("UPDATE `VoiceChannels` SET Open = 0 WHERE `UserID` = ?", msg.author.id);
    },
};
