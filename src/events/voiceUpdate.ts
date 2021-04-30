import { Client, VoiceState } from "discord.js";

export const name = "voiceStateUpdate";

export default function voiceUpdate(client: Client) {

    return async (oldState: VoiceState, newState: VoiceState) => {
        return;
        try {
            const query = `
                SELECT VCMembers.UserID, VCMembers.ChannelID, Open, VoiceChannels.UserID AS OwnerID
                FROM VCMembers
                INNER JOIN VoiceChannels ON VoiceChannels.ChannelID = VCMembers.ChannelID
                WHERE VCMembers.UserID = ?
            `

            // Check if user left a vc.
            if (newState.channelID !== oldState.channelID) {
                // Define db.
                let conn = client.conn;
                // Query db for user priv room data.
                let userChannel = await conn.query(query, newState.member?.id);
                userChannel = userChannel[0]
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
                    (await conn).query("DELETE FROM VCMembers WHERE UserID = ?", oldState.member?.id);
                    // Query db for new owner.
                    let newOwner = await conn.query("SELECT * FROM VCMembers WHERE ChannelID = ? ORDER BY Date ASC;", userChannel.ChannelID);
                    newOwner = newOwner[0];
                    // Check if there is a replacement owner.
                    if (newOwner == undefined) {
                        // Reset vc.
                        console.log("no replacement owner, resetting vc.")
                        return await conn.query("UPDATE VoiceChannels SET UserID = NULL, Date = NULL, Open = 1 WHERE UserID = ?", oldState.member?.id);
                    } else {
                        // Assign vc to new owner.
                        console.log("replacement owner found")
                        return await conn.query("UPDATE VoiceChannels SET UserID = ? WHERE ChannelID = ?", [newOwner.UserID, userChannel.ChannelID]);
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