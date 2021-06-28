import { Logs_Event } from "@prisma/client";
import { Client, Message, PartialMessage, User } from "discord.js";
import logHandler from "../middleware/logHandler";

export const name = "messageUpdate";


export default function guildAdd(_client: Client) {

    return async (oldmsg: Message | PartialMessage, newmsg: Message | PartialMessage) => {
        try {
            if (oldmsg.author?.bot) { return; }
            if (oldmsg.guild === null) { return; }
            if (oldmsg.content === null) { return; }
            if (oldmsg.content === newmsg.content) { return; }

            logHandler(Logs_Event.Message_Update, oldmsg.guild.id, oldmsg.author as User);

            console.log(`Message update \n from: ${oldmsg.content} \n to: ${newmsg.content}`);
        } catch (e) {
            console.log(e);
        }
    };
}