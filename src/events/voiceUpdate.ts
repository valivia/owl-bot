import { Client, Message, PartialMessage, User, VoiceState } from "discord.js";
import logHandler from "../middleware/logHandler";

export const name =  "voiceStateUpdate";

export default function voiceUpdate(client: Client) {

    return async (oldState: VoiceState, newState: VoiceState) => {
        try {
            const query = `
                SELECT VCMembers.UserID, VCMembers.ChannelID, Open, VoiceCHannels.UserID AS OwnerID
                FROM VCMembers
                INNER JOIN VoiceChannels ON VoiceChannels.ChannelID = VCMembers.ChannelID
                WHERE VCMembers.UserID = ?
            `

            // Check if user left a vc.
            if (newState.channelID !== oldState.channelID) {
                // Define db.
                const db = client.db;
                // Query db for user priv room data.
                const userChannel = await db.get(query, newState.member?.id)
                // Check if user is part of priv room.
                if (userChannel == undefined) {
                    return;
                }
                // Check if moved into priv vc.
                if (newState.channelID == userChannel.ChannelID) {
                    return;
                }
                // log.
                console.log(`${oldState.member?.displayName} left priv room`)
                // Check if user owns a room.
                if (userChannel.UserID == userChannel.OwnerID) {
                    // Delete user from vc list.
                    db.run("DELETE FROM VCMembers WHERE UserID = ?", oldState.member?.id);
                    // Query db for new owner.
                    let newOwner = await db.get("SELECT * FROM VCMembers WHERE ChannelID = ? ORDER BY Date ASC;", userChannel.ChannelID);
                    // Check if there is a replacement owner.
                    if (newOwner == undefined) {
                        // Reset vc.
                        console.log("no replacement owner, resetting vc.")
                        return await db.run("UPDATE VoiceChannels SET UserID = NULL, Date = NULL, Open = 1 WHERE UserID = ?", oldState.member?.id);
                    } else {
                        // Assign vc to new owner.
                        console.log("replacement owner found")
                        return await db.run("UPDATE VoiceChannels SET UserID = ? WHERE ChannelID = ?", [newOwner.UserID, userChannel.ChannelID]);
                    }
                }
            }
            return;
        } catch (e) {
            console.log(e);

            return;
        }
    };
}


/*if (newState.channelID == null ) {
    return logHandler("voiceCHannel", `User left vc ${oldState.channel?.name}`, oldState.member?.user as User, 2);
}
else {
    return logHandler("voiceCHannel", `User joined vc ${newState.channel?.name}`, oldState.member?.user as User, 2);
}*/
//logHandler("Message update", oldmsg.content.length !== 0 ? oldmsg.content : "no content" , oldmsg.author as User, 1);

//console.log(`Message update \n from: ${oldmsg.content} \n to: ${newmsg.content}`);