import { Client, GuildMember, MessageEmbed } from "discord.js";
import logHandler from "../../middleware/logHandler";
import { defaultErr } from "../../middleware/modules";

module.exports = {
    name: "host",
    aliases: [""],
    description: "Host a private room",
    examples: [""],
    group: "vc",

    guildOnly: true,
    adminOnly: false,
    slash: true,

    throttling: {
        duration: 30,
        usages: 3,
    },


    async execute(author: GuildMember, _: undefined, client: Client) {
        let conn = client.conn;
        try {
            // Check if in vc.
            if (author.voice.channel == null) {
                return { type: "content", content: "Please join a voice channel first." };
            }

            // Query db for user's active vcs.
            let userChannel = await conn.query("SELECT * FROM VoiceChannels WHERE `UserID` = ?", author.id);
            userChannel = userChannel[0];

            if (userChannel !== undefined) {
                // Move user into vc.
                author.voice.setChannel(userChannel.ChannelID);
                // Send message.
                return { type: "content", content: "moved back into your vc" }
            }

            // Query open voicechannels
            let openChannels = await conn.query("SELECT * FROM VoiceChannels WHERE `UserID` IS NULL");
            openChannels = openChannels[0];

            // Check if available channels.
            if (openChannels === undefined || openChannels.length == 0) {
                return { type: "content", content: "There are no more private rooms available." };
            }

            // Update db.
            await conn.query("UPDATE VoiceChannels SET UserID = ?, Date = ? WHERE ChannelID = ?", [author.id, Date.now(), openChannels.ChannelID]);

            // Add user to db.
            await conn.query("INSERT INTO VCMembers (UserID, ChannelID, Date) VALUES (?,?,?)", [author.id, openChannels.ChannelID, Date.now()]);

            // Move user into private vc.
            author.voice.setChannel(openChannels.ChannelID);

            // Log
            logHandler("vc assigned", "a vc was assigned", author.user, 0);

            // Make embed
            const embed = new MessageEmbed()
                .addField("Success", (`Successfully assigned a voice channel`))
                .setColor("#559b0f")
                .setTimestamp();

            // Send message.
            return { type: "embed", content: embed }
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    },
};
