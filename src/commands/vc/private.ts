import { Message } from "discord.js";
import { Database } from "sqlite";
module.exports = {
    name: "private",

    aliases: [""],
    description: "toggle privacy",
    examples: [""],
    group: "vc",
    guildOnly: true,

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(msg: Message, _args: object[], db: Database) {
        let userChannel = await db.get("SELECT * FROM VoiceChannels WHERE UserID = ?", msg.author.id)
        // Check if user has a vc.
        if (userChannel == undefined) {
            return msg.reply("You dont have an active private voicechat")
        }

        // Make vc private/open
        await db.run("UPDATE `VoiceChannels` SET Open = ? WHERE `UserID` = ?", [userChannel.Open == 1 ? 0 : 1 ,msg.author.id]);

        // Notify user.
        return msg.channel.send(`Your voicechannel is now ${userChannel.Open == 1 ? "closed" : "open"}.`)
    },
};
