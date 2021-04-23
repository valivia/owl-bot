"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = void 0;
exports.name = "voiceStateUpdate";
function voiceUpdate(client) {
    return (oldState, newState) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const query = `
                SELECT VCMembers.UserID, VCMembers.ChannelID, Open, VoiceChannels.UserID AS OwnerID
                FROM VCMembers
                INNER JOIN VoiceChannels ON VoiceChannels.ChannelID = VCMembers.ChannelID
                WHERE VCMembers.UserID = ?
            `;
            // Check if user left a vc.
            if (newState.channelID !== oldState.channelID) {
                // Define db.
                let conn = client.conn;
                // Query db for user priv room data.
                let userChannel = yield conn.query(query, (_a = newState.member) === null || _a === void 0 ? void 0 : _a.id);
                userChannel = userChannel[0];
                // Check if user is part of priv room.
                if (userChannel == undefined) {
                    return;
                }
                // Check if moved into priv vc.
                if (newState.channelID == userChannel.ChannelID) {
                    return;
                }
                // log.
                console.log(`${(_b = oldState.member) === null || _b === void 0 ? void 0 : _b.displayName} left priv room`);
                // Check if user owns a room.
                if (userChannel.UserID == userChannel.OwnerID) {
                    // Delete user from vc list.
                    (yield conn).query("DELETE FROM VCMembers WHERE UserID = ?", (_c = oldState.member) === null || _c === void 0 ? void 0 : _c.id);
                    // Query db for new owner.
                    let newOwner = yield conn.query("SELECT * FROM VCMembers WHERE ChannelID = ? ORDER BY Date ASC;", userChannel.ChannelID);
                    newOwner = newOwner[0];
                    // Check if there is a replacement owner.
                    if (newOwner == undefined) {
                        // Reset vc.
                        console.log("no replacement owner, resetting vc.");
                        return yield conn.query("UPDATE VoiceChannels SET UserID = NULL, Date = NULL, Open = 1 WHERE UserID = ?", (_d = oldState.member) === null || _d === void 0 ? void 0 : _d.id);
                    }
                    else {
                        // Assign vc to new owner.
                        console.log("replacement owner found");
                        return yield conn.query("UPDATE VoiceChannels SET UserID = ? WHERE ChannelID = ?", [newOwner.UserID, userChannel.ChannelID]);
                    }
                }
            }
            return;
        }
        catch (e) {
            console.log(e);
            return;
        }
    });
}
exports.default = voiceUpdate;
/*if (newState.channelID == null ) {
    return logHandler("voiceCHannel", `User left vc ${oldState.channel?.name}`, oldState.member?.user as User, 2);
}
else {
    return logHandler("voiceCHannel", `User joined vc ${newState.channel?.name}`, oldState.member?.user as User, 2);
}*/
//logHandler("Message update", oldmsg.content.length !== 0 ? oldmsg.content : "no content" , oldmsg.author as User, 1);
//console.log(`Message update \n from: ${oldmsg.content} \n to: ${newmsg.content}`);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm9pY2VVcGRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2b2ljZVVwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFHYSxRQUFBLElBQUksR0FBRyxrQkFBa0IsQ0FBQztBQUV2QyxTQUF3QixXQUFXLENBQUMsTUFBYztJQUU5QyxPQUFPLENBQU8sUUFBb0IsRUFBRSxRQUFvQixFQUFFLEVBQUU7O1FBQ3hELElBQUk7WUFDQSxNQUFNLEtBQUssR0FBRzs7Ozs7YUFLYixDQUFBO1lBRUQsMkJBQTJCO1lBQzNCLElBQUksUUFBUSxDQUFDLFNBQVMsS0FBSyxRQUFRLENBQUMsU0FBUyxFQUFFO2dCQUMzQyxhQUFhO2dCQUNiLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZCLG9DQUFvQztnQkFDcEMsSUFBSSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBRSxRQUFRLENBQUMsTUFBTSwwQ0FBRSxFQUFFLENBQUMsQ0FBQztnQkFDL0QsV0FBVyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDNUIsc0NBQXNDO2dCQUN0QyxJQUFJLFdBQVcsSUFBSSxTQUFTLEVBQUU7b0JBQzFCLE9BQU87aUJBQ1Y7Z0JBQ0QsK0JBQStCO2dCQUMvQixJQUFJLFFBQVEsQ0FBQyxTQUFTLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRTtvQkFDN0MsT0FBTztpQkFDVjtnQkFDRCxPQUFPO2dCQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFBLFFBQVEsQ0FBQyxNQUFNLDBDQUFFLFdBQVcsaUJBQWlCLENBQUMsQ0FBQTtnQkFDN0QsNkJBQTZCO2dCQUM3QixJQUFJLFdBQVcsQ0FBQyxNQUFNLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRTtvQkFDM0MsNEJBQTRCO29CQUM1QixDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLHdDQUF3QyxRQUFFLFFBQVEsQ0FBQyxNQUFNLDBDQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNsRiwwQkFBMEI7b0JBQzFCLElBQUksUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxnRUFBZ0UsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3pILFFBQVEsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLHlDQUF5QztvQkFDekMsSUFBSSxRQUFRLElBQUksU0FBUyxFQUFFO3dCQUN2QixZQUFZO3dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQTt3QkFDbEQsT0FBTyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsZ0ZBQWdGLFFBQUUsUUFBUSxDQUFDLE1BQU0sMENBQUUsRUFBRSxDQUFDLENBQUM7cUJBQ2xJO3lCQUFNO3dCQUNILDBCQUEwQjt3QkFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO3dCQUN0QyxPQUFPLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyx5REFBeUQsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7cUJBQ2hJO2lCQUNKO2FBQ0o7WUFDRCxPQUFPO1NBQ1Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFZixPQUFPO1NBQ1Y7SUFDTCxDQUFDLENBQUEsQ0FBQztBQUNOLENBQUM7QUF0REQsOEJBc0RDO0FBR0Q7Ozs7O0dBS0c7QUFDSCx1SEFBdUg7QUFFdkgsb0ZBQW9GIn0=