import { Logs_Event } from "@prisma/client";
import { Message, PartialMessage, User } from "discord.js";
import logHandler from "../middleware/logHandler";
import { OwlClient } from "../types/classes";

export default function messageUpdate(_client: OwlClient) {

    return async (oldmsg: Message | PartialMessage, newmsg: Message | PartialMessage): Promise<void> => {
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