import { Client, GuildMember, MessageEmbed } from "discord.js";
import { argType, Iresponse } from "../../interfaces";

module.exports = {
    name: "warn",
    aliases: [""],
    description: "warns a user",
    example: "@valivia memes in general",
    group: "moderator",

    guildOnly: true,
    adminOnly: false,
    slash: true,

    args: [
        {
            "type": argType.user,
            "name": "member",
            "description": "User to warn",
            "default": false,
            "required": true
        },
        {
            "type": argType.string,
            "name": "reason",
            "description": "Reason why the user is getting warned",
            "default": false,
            "required": false
        }
    ],

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(author: GuildMember, { member, reason }: { member: GuildMember, reason: string }, { conn }: Client): Promise<Iresponse> {
        if (reason === undefined) { reason = "No reason provided" }
        try {
            // insert into db.
            await conn.query("INSERT INTO Warnings (UserID,Reason,Date,GuildID,ModID) VALUES(?,?,?,?,?)", [member.id, reason.substr(0, 256), Date.now(), member.guild?.id, author.id])
                .catch(e => {
                    console.log(e);
                    return { type: "text", content: "an error occured" };
                });
            // make embed.
            let embed = new MessageEmbed()
                .setAuthor(`${member.user.username}#${member.user.discriminator} has been warned`)
                .setDescription(`**reason:** ${reason}`)
                .setColor(5362138)
            // send embed.
            return { type: "embed", content: embed };
        } catch (e) {
            console.log(e);
            return { type: "text", content: "an error occured" };
        }
    },
};