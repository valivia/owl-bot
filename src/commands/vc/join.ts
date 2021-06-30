import { GuildMember } from "discord.js";
import { defaultErr } from "../../middleware/modules";
import { Command, OwlClient } from "../../types/classes";
import { argType, MsgResponse } from "../../types/types";

module.exports = class extends Command {
    constructor(client: OwlClient) {
        super(client, {
            name: "join",
            aliases: [""],
            description: "Join a private room",
            example: "@valivia",
            group: "vc",

            guildOnly: true,
            adminOnly: false,
            slash: true,

            args: [
                {
                    "type": argType.user,
                    "name": "user",
                    "description": "Which user to join",
                    "default": false,
                    "required": true,
                },
            ],

            throttling: {
                duration: 30,
                usages: 3,
            },
        });
    }

    async run(author: GuildMember, { user }: { user: GuildMember }, client: OwlClient): Promise<MsgResponse> {
        const conn = client.conn;
        try {

            /* if (author.id === user.id) {
                return { type: "disabled", content: "You cant join yourself." }
            }*/

            const result = await conn.vCMembers.findFirst({
                where: {
                    UserID: user.id,
                    VoiceChannels: { GuildID: author.guild.id },
                },
                include: { VoiceChannels: true },
            });

            console.log(result);

            if (result === null) {
                return { type: "text", content: "This user isnt in a voice channel." };
            }

            // const channel = await client.channels.fetch(result.ChannelID) as VoiceChannel;

            return { type: "disabled", content: "Wait for user to respond." };
        } catch (e) {
            console.log(e);
            return defaultErr;
        }
    }
};

/*
async function msgHandler(msg: Message) {
    await msg.react("✔️");

    const filter = (reaction: MessageReaction, user: User) => {
        return reaction.emoji.name === "✔️" && user.id === user.id;
    };

    const collector = await msg.createReactionCollector(filter, { time: 120000 });

    collector.on("collect", async () => {
        const channel = await client.channels.fetch(result.ChannelID) as VoiceChannel;
        channel.createOverwrite(author.id, { CONNECT: true }, "Private room join.");
        author.voice.setChannel(result.ChannelID);
    })
}*/