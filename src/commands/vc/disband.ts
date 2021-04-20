import { Message } from "discord.js";
import { Database } from "sqlite";
module.exports = {
    name: "disband",

    aliases: [""],
    description: "disband personal vc",
    examples: [""],
    group: "vc",
    guildOnly: true,

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(msg: Message, _args: object[], db: Database) {
        // return console.log(msg.member?.voice.channel.members);
        let userChannel = await db.get("SELECT * FROM `VoiceChannels` WHERE `UserID` = ?", msg.author.id)
        // Check if user has a vc.
        if (userChannel == undefined) {
            return msg.reply("You dont have an active private voicechat")
        }

        // delete vc from db.
        await db.run("UPDATE `VoiceChannels` SET UserID = NULL, Date = NULL, Open = 1 WHERE `UserID` = ?", msg.author.id);
        await db.run("DELETE FROM VCMembers WHERE ChannelID = ?", userChannel.ChannelID)

        // Check if in vc.
        if (msg.member?.voice.channel !== null && msg.member?.voice.channel.id == userChannel.ChannelID) {
            // kick from vc
            msg.member?.voice.channel.members.forEach(member => {
                member.voice.kick();
            });
        }
        // Send message
        return msg.reply("voice channel disbanded");
    },
};
