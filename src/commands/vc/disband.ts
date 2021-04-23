import { Message } from "discord.js";
import { Connection } from "mariadb";
module.exports = {
    name: "disband",
    aliases: [""],
    description: "creates a new priv room.",
    examples: ["create myPrivateRoom"],
    group: "moderator",

    guildOnly: true,
    adminOnly: false,
    slash: true,

    args: [
        {
            "type": "string",
            "name": "channelName",
            "description": "Name of the channel",
            "default": false,
            "required": true
        }
    ],

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(msg: Message, _args: object[], conn: Connection) {
        try {
            let userChannel = await conn.query("SELECT * FROM `VoiceChannels` WHERE `UserID` = ?", msg.author.id)
            userChannel = userChannel[0];

            // Check if user has a vc.
            if (userChannel == undefined) {
                return msg.reply("You dont have an active private voicechat")
            }

            // delete vc from db.
            await conn.query("UPDATE `VoiceChannels` SET UserID = NULL, Date = NULL, Open = 1 WHERE `UserID` = ?", msg.author.id);
            await conn.query("DELETE FROM VCMembers WHERE ChannelID = ?", userChannel.ChannelID)

            // Check if in vc.
            if (msg.member?.voice.channel !== null && msg.member?.voice.channel.id == userChannel.ChannelID) {
                // kick from vc
                msg.member?.voice.channel.members.forEach(member => {
                    member.voice.kick();
                });
            }
            // Send message
            return msg.reply("voice channel disbanded");
        } catch (e) {
            console.log(e);
            return msg.reply("an error occured");
        }
    },
};
