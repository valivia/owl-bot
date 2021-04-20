import { Message, MessageEmbed } from "discord.js";
import { Database } from "sqlite";
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

    async execute(msg: Message, _args: object[], db: Database) {

        // Check if in vc.
        if (msg.member?.voice.channel == null) {
            return msg.reply("Please join a voice channel first.")
        }

        // Query db for user's active vcs.
        const userChannel = await db.get("SELECT * FROM VoiceChannels WHERE `UserID` = ?", msg.author.id);

        if ( userChannel !== undefined) {
            // Move user into vc.
            msg.member.voice.setChannel(userChannel.ChannelID);
            // Send message.
            return msg.reply("moved back into your vc");
        }

        // Query open voicechannels
        const openChannels = await db.all("SELECT * FROM VoiceChannels WHERE `UserID` IS NULL");

        // Check if available channels.
        if (openChannels.length == 0) {
            return msg.reply("There are no more private rooms available.")
        }

        // Update db.
        await db.run("UPDATE VoiceChannels SET UserID = ?, Date = ? WHERE ChannelID = ?", [msg.author.id, Date.now(), openChannels[0].ChannelID])

        // Add user to db.
        await db.run("INSERT INTO VCMembers (UserID, ChannelID, Date) VALUES (?,?,?)", [msg.author.id, openChannels[0].ChannelID, Date.now()])\

        // Move user into private vc.
        msg.member.voice.setChannel(openChannels[0].ChannelID);

        // Log
        logHandler("vc assigned", "a vc was assigned", msg.author, 0);

        // Make embed
        const success = new MessageEmbed()
        .addField("Success", (`Successfully assigned a voice channel`))
        .setColor("#559b0f")
        .setTimestamp();

        // Send message.
        return msg.channel.send(success);
    },
};
