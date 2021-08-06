import { Interaction } from "discord.js";
import { runCommand } from "../middleware/commandHandler";;

export default function messageDelete() {

    return async (interaction: Interaction): Promise<void> => {
        try {
            if (!interaction.isCommand()) return;
            const args = [];
            // loop through arguments.
            interaction.options.data.forEach((x) => {
                args.push(x.value);
            });

            const user = interaction.member ?? interaction.user;

            // Execute command.
            const response = user !== undefined ? await runCommand(user, interaction.commandName, args, interaction.client) : { type: "content", content: "an error occured" };
            // Respond.
            interaction.reply({ embeds: response.embeds });
        } catch (e) {
            console.log(e);
            return;
        }
    };
}