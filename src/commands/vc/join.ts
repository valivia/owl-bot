import { Client, GuildMember, MessageReaction, User } from "discord.js";
import { Iresponse } from "../../interfaces";
module.exports = {
    name: "join",
    aliases: [""],
    description: "Join a private room",
    examples: ["@valivia"],
    group: "vc",

    guildOnly: true,
    adminOnly: false,
    slash: true,

    args: [
        {
            "type": "user",
            "name": "user",
            "description": "Which user to join",
            "default": false,
            "required": true
        }
    ],

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(author: GuildMember, { user }: { user: GuildMember }, client: Client): Promise<Iresponse> {
        let conn = client.conn;
        try {
            const query =
                `   SELECT VCMembers.UserID, VCMembers.ChannelID, Open, VoiceCHannels.UserID AS OwnerID
                FROM VCMembers
                INNER JOIN VoiceChannels ON VoiceChannels.ChannelID = VCMembers.ChannelID
                WHERE VCMembers.UserID = ?
            `

            // Check if in vc.
            if (author.voice.channel == null) {
                return { type: "text", content: "Please join a voice channel first." };
            }

            // Query db for pinged user.
            let userChannel = await conn.query(query, user.id);
            // Check if user is part of a vc.
            if (userChannel == undefined) {
                return { type: "text", content: "This person is not part of a private room." };
            }
            // let channelMembers = await db.all("SELECT * FROM `VCMembers` WHERE `ChannelID` = ?", userChannel.ChannelID);

            // Check if room is open.
            if (userChannel.Open == 1) {
                // Drag user in.
                author.voice.setChannel(userChannel.ChannelID);
                return;
            }

            // React with emote.
            //await .react("✔️"); // WATCH

            // Reaction filter.
            const filter = (reaction: MessageReaction, user: User) => {
                return reaction.emoji.name === "✔️" && user.id === user.id;
            };

            // Initiate collector
            const collector = msg.createReactionCollector(filter, { time: 120000 });

            // Emote gets added.
            collector.on('collect', async () => {
                // move user into vc.
                author.voice.setChannel(userChannel.ChannelID);
                // Add user to db.
                await conn.query("INSERT INTO `VCMembers` (UserID, ChannelID, Date) VALUES (?,?,?)", [msg.author.id, userChannel.ChannelID, Date.now()])
            });


            collector.on('end', () => {
                return { type: "text", content: "Nobody accepted your request in time." };
            });
            return;
        } catch (e) {
            console.log(e);
            return msg.reply("an error occured");
        }
    },
};

