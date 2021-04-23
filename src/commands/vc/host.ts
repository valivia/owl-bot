import { Message, MessageEmbed } from "discord.js";
import { Connection } from "mariadb";
import logHandler from "../../middleware/logHandler";
module.exports = {
    name: "host",

    aliases: [""],
    description: "creates a private room.",
    examples: [""],
    group: "vc",
    guildOnly: true,

    throttling: {
        duration: 30,
        usages: 1,
    },

    async execute(msg: Message, _args: object[], conn: Connection) {
        try {
            // Check if in vc.
            if (msg.member?.voice.channel == null) {
                return msg.reply("Please join a voice channel first.")
            }

            // Query db for user's active vcs.
            let userChannel = await conn.query("SELECT * FROM VoiceChannels WHERE `UserID` = ?", msg.author.id);
            userChannel = userChannel[0];

            if (userChannel !== undefined) {
                // Move user into vc.
                msg.member.voice.setChannel(userChannel.ChannelID);
                // Send message.
                return msg.reply("moved back into your vc");
            }

            // Query open voicechannels
            let openChannels = await conn.query("SELECT * FROM VoiceChannels WHERE `UserID` IS NULL");
            openChannels = openChannels[0];

            // Check if available channels.
            if (openChannels === undefined || openChannels.length == 0) {
                return msg.reply("There are no more private rooms available.")
            }

            // Update db.
            await conn.query("UPDATE VoiceChannels SET UserID = ?, Date = ? WHERE ChannelID = ?", [msg.author.id, Date.now(), openChannels.ChannelID]);

            // Add user to db.
            await conn.query("INSERT INTO VCMembers (UserID, ChannelID, Date) VALUES (?,?,?)", [msg.author.id, openChannels.ChannelID, Date.now()]);

            // Move user into private vc.
            msg.member.voice.setChannel(openChannels.ChannelID);

            // Log
            logHandler("vc assigned", "a vc was assigned", msg.author, 0);

            // Make embed
            const success = new MessageEmbed()
                .addField("Success", (`Successfully assigned a voice channel`))
                .setColor("#559b0f")
                .setTimestamp();

            // Send message.
            return msg.channel.send(success);
        } catch (e) {
            console.log(e);
            return msg.reply("an error occured");
        }
    },
};
