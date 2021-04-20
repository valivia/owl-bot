import { Message, MessageEmbed } from "discord.js";
import { Database } from "sqlite";

module.exports = {
    name: "addword",

    adminOnly: true,
    aliases: ["aw"],
    description: "adds a word to the filter.",
    example: ["bitch"],
    group: "moderator",
    memberName: "addword",
    required: true,
    guildOnly: false,

    throttling: {
        amount: 2,
        time: 10,
    },

    async execute(msg: Message, args: object[], db: Database) {
        let reason = args.join(" ").toLowerCase();

        let query = "INSERT OR IGNORE INTO WORDFILTER (WORD, DATE) VALUES(?, ?);";

        try {
            //insert into database.
            await db.run(query, [
                reason,
                Date.now()
            ])

            loadList(msg.client);

            // send message.
            const success = new MessageEmbed()
                .addField("success", (`added word to database.`))
                .setColor("#559b0f")
                .setTimestamp();
            msg.channel.send(success);

        } catch (e) {
            // log error.
            console.log(e);

            // notify user about failure.
            const FailEmbed = new MessageEmbed()
            .addField("***Failed***", (`An error has occured`))
            .setColor("#F50303")
            .setTimestamp();

        msg.channel.send(FailEmbed);

        return;
        }
    },
};