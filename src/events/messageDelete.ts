import { Message, PartialMessage, User } from "discord.js";
import logHandler from "../middleware/logHandler";

export const name =  "messageDelete";

export default function messageDelete() {

    return async (msg: Message | PartialMessage) => {
        try {
            if (msg.author?.bot) { return; };
            if (msg.content === null) { return; }
            logHandler("Message deleted", msg.content?.length !== 0 ? msg.content : "image", msg.author as User, 1);

            console.log(`message deleted from ${msg.author?.id}: ${msg.content}`);
        } catch (e) {
            console.log(e);
        }
    };
}