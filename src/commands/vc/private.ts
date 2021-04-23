import { Message } from "discord.js";
import { Connection } from "mariadb";
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

    async execute(msg: Message, _args: object[], conn: Connection) {
        try {
            let userChannel = await conn.query("SELECT * FROM VoiceChannels WHERE UserID = ?", msg.author.id)
            userChannel = userChannel[0];
            // Check if user has a vc.
            if (userChannel == undefined) {
                return msg.reply("You dont have an active private voicechat")
            }

            // Make vc private/open
            await conn.query("UPDATE `VoiceChannels` SET Open = ? WHERE `UserID` = ?", [userChannel.Open == 1 ? 0 : 1, msg.author.id]);

            // Notify user.
            return msg.channel.send(`Your voicechannel is now ${userChannel.Open == 1 ? "closed" : "open"}.`)
        } catch (e) {
            console.log(e);
            return msg.reply("an error occured");
        }
    },
};
