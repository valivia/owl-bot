import { Message, PartialMessage, User } from "discord.js";
import { logType } from "../interfaces";
import logHandler from "../middleware/logHandler";

export const name =  "messageDelete";

export default function messageDelete() {

    return async (msg: Message | PartialMessage) => {
        try {
            if (msg.author?.bot) { return; };
            logHandler("Message deleted", msg.content || msg.attachments.first().url || "unknown", msg.author as User, logType.bad);

            console.log(`message deleted from ${msg.author?.id}: ${msg.content}`);
        } catch (e) {
            console.log(e);
        }
    };
}