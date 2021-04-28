import { Client, Message, PartialMessage, User } from "discord.js";
import logHandler from "../middleware/logHandler";

export const name =  "messageUpdate";


export default function guildAdd(_client: Client) {

    return async (oldmsg: Message | PartialMessage, newmsg: Message | PartialMessage) => {
        try {
            // check if messaged actually changed.
            if (oldmsg.content === newmsg.content) { return; }

            // check if there is a message.
            if (oldmsg.content === null) { return; }

            logHandler("Message update", oldmsg.content.length !== 0 ? oldmsg.content : "no content" , oldmsg.author as User, 1);

            console.log(`Message update \n from: ${oldmsg.content} \n to: ${newmsg.content}`);
        } catch (e) {
            console.log(e);
        }
    };
}