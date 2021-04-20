import { Message, MessageReaction, User } from "discord.js";
import { Database } from "sqlite";
module.exports = {
    name: "join",

    aliases: [""],
    description: "Join someone else's private room.",
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
        const query =
            `   SELECT VCMembers.UserID, VCMembers.ChannelID, Open, VoiceCHannels.UserID AS OwnerID
                FROM VCMembers
                INNER JOIN VoiceChannels ON VoiceChannels.ChannelID = VCMembers.ChannelID
                WHERE VCMembers.UserID = ?
            `

        // Check if in vc.
        if (msg.member?.voice.channel == null) {
            return msg.reply("Please join a voice channel first.")
        }

        // Query db for pinged user.
        let userChannel = await db.get(query, pingedUser.id);
        // Check if user is part of a vc.
        if (userChannel == undefined) {
            return msg.reply("This person is not part of a private room.")
        }
        // let channelMembers = await db.all("SELECT * FROM `VCMembers` WHERE `ChannelID` = ?", userChannel.ChannelID);

        // Check if room is open.
        if (userChannel.Open == 1) {
            // Drag user in.
            return msg.member?.voice.setChannel(userChannel.ChannelID);
        }

        // React with emote.
        await msg.react("✔️");

        // Reaction filter.
        const filter = (reaction: MessageReaction, user: User) => {
            return reaction.emoji.name === "✔️" && user.id === pingedUser.id;
        };

        // Initiate collector
        const collector = msg.createReactionCollector(filter, { time: 120000 });

        // Emote gets added.
        collector.on('collect', async () => {
            // move user into vc.
            msg.member?.voice.setChannel(userChannel.ChannelID);
            // Add user to db.
            await db.run("INSERT INTO `VCMembers` (UserID, ChannelID, Date) VALUES (?,?,?)", [msg.author.id, userChannel.ChannelID, Date.now()])
        });


        collector.on('end', () => {
            return msg.reply("Nobody accepted your request in time.")
        });
        return;
    },
};

