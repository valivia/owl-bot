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
module.exports = {
    name: "disband",
    aliases: [""],
    description: "creates a new priv room.",
    examples: ["create myPrivateRoom"],
    group: "moderator",
    guildOnly: true,
    adminOnly: false,
    slash: true,
    args: [
        {
            "type": "string",
            "name": "channelName",
            "description": "Name of the channel",
            "default": false,
            "required": true
        }
    ],
    throttling: {
        duration: 30,
        usages: 3,
    },
    execute(msg, _args, conn) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userChannel = yield conn.query("SELECT * FROM `VoiceChannels` WHERE `UserID` = ?", msg.author.id);
                userChannel = userChannel[0];
                // Check if user has a vc.
                if (userChannel == undefined) {
                    return msg.reply("You dont have an active private voicechat");
                }
                // delete vc from db.
                yield conn.query("UPDATE `VoiceChannels` SET UserID = NULL, Date = NULL, Open = 1 WHERE `UserID` = ?", msg.author.id);
                yield conn.query("DELETE FROM VCMembers WHERE ChannelID = ?", userChannel.ChannelID);
                // Check if in vc.
                if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice.channel) !== null && ((_b = msg.member) === null || _b === void 0 ? void 0 : _b.voice.channel.id) == userChannel.ChannelID) {
                    // kick from vc
                    (_c = msg.member) === null || _c === void 0 ? void 0 : _c.voice.channel.members.forEach(member => {
                        member.voice.kick();
                    });
                }
                // Send message
                return msg.reply("voice channel disbanded");
            }
            catch (e) {
                console.log(e);
                return msg.reply("an error occured");
            }
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzYmFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpc2JhbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2IsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDYixXQUFXLEVBQUUsMEJBQTBCO0lBQ3ZDLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixDQUFDO0lBQ2xDLEtBQUssRUFBRSxXQUFXO0lBRWxCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsU0FBUyxFQUFFLEtBQUs7SUFDaEIsS0FBSyxFQUFFLElBQUk7SUFFWCxJQUFJLEVBQUU7UUFDRjtZQUNJLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE1BQU0sRUFBRSxhQUFhO1lBQ3JCLGFBQWEsRUFBRSxxQkFBcUI7WUFDcEMsU0FBUyxFQUFFLEtBQUs7WUFDaEIsVUFBVSxFQUFFLElBQUk7U0FDbkI7S0FDSjtJQUVELFVBQVUsRUFBRTtRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osTUFBTSxFQUFFLENBQUM7S0FDWjtJQUVLLE9BQU8sQ0FBQyxHQUFZLEVBQUUsS0FBZSxFQUFFLElBQWdCOzs7WUFDekQsSUFBSTtnQkFDQSxJQUFJLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsa0RBQWtELEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDckcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFN0IsMEJBQTBCO2dCQUMxQixJQUFJLFdBQVcsSUFBSSxTQUFTLEVBQUU7b0JBQzFCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFBO2lCQUNoRTtnQkFFRCxxQkFBcUI7Z0JBQ3JCLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxvRkFBb0YsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN0SCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsMkNBQTJDLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFBO2dCQUVwRixrQkFBa0I7Z0JBQ2xCLElBQUksT0FBQSxHQUFHLENBQUMsTUFBTSwwQ0FBRSxLQUFLLENBQUMsT0FBTyxNQUFLLElBQUksSUFBSSxPQUFBLEdBQUcsQ0FBQyxNQUFNLDBDQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUU7b0JBQzdGLGVBQWU7b0JBQ2YsTUFBQSxHQUFHLENBQUMsTUFBTSwwQ0FBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7d0JBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3hCLENBQUMsRUFBRTtpQkFDTjtnQkFDRCxlQUFlO2dCQUNmLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2FBQy9DO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQzthQUN4Qzs7S0FDSjtDQUNKLENBQUMifQ==