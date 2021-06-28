import { Logs_Event } from "@prisma/client";
import { Message, PartialMessage } from "discord.js";
import logHandler from "../middleware/logHandler";

export const name = "messageDelete";

export default function messageDelete() {

    return async (msg: Message | PartialMessage): Promise<void> => {
        try {
            if (msg.author?.bot) return;
            if (!msg.guild) return;
            if (!msg.author) return;
            if (!msg.content) return;

            logHandler(Logs_Event.Message_Delete, msg.guild?.id, msg.author, msg.content);

            console.log(`message deleted from ${msg.author?.id}: ${msg.content}`);
        } catch (e) {
            console.log(e);
            return;
        }
    };
}