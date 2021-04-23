import { Client, Message, MessageEmbed } from "discord.js";
import { Connection } from "mariadb";
module.exports = {
    name: "disable",

    aliases: [""],
    description: "eval",
    examples: [""],
    group: "owner",
    guildOnly: true,
    required: true,
    adminOnly: true,

    throttling: {
        duration: 30,
        usages: 3,
    },

    async execute(msg: Message, args: object[], _conn: Connection, client: Client) {
        let result;
        try {
            result = args.join(" ");
            let noResultArg = new MessageEmbed()
                .setColor("#e31212")
                .setDescription("ERROR: No valid eval args were provided")
            if (!result) return msg.channel.send(noResultArg)
            let evaled = eval(result);

            let resultSuccess = new MessageEmbed()
                .setColor("#8f82ff")
                .setTitle("Success")
                .addField(`Input:\n`, '```js\n' + `${args.join(" ").slice(5)}` + '```', false)
                .addField(`Output:\n`, '```js\n' + evaled + '```', true)

            return msg.channel.send(resultSuccess)
        } catch (error) {
            let resultError = new MessageEmbed()
            .setColor("#e31212")
            .setTitle("An error has occured")
            .addField(`Input:\n`, '```js\n' + `${result}` + '```', false)
            .addField(`Output:\n`, '```js\n' + `${error.message}` + '```', true)
            //.setDescription(`Output:\n\`\`\`${err}\`\`\``)
            return msg.channel.send(resultError)
        }
    },
};
