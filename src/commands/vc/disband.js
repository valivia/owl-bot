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
    description: "disband personal vc",
    examples: [""],
    group: "vc",
    guildOnly: true,
    throttling: {
        duration: 30,
        usages: 3,
    },
    execute(msg, _args, db) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // return console.log(msg.member?.voice.channel.members);
            let userChannel = yield db.get("SELECT * FROM `VoiceChannels` WHERE `UserID` = ?", msg.author.id);
            // Check if user has a vc.
            if (userChannel == undefined) {
                return msg.reply("You dont have an active private voicechat");
            }
            // delete vc from db.
            yield db.run("UPDATE `VoiceChannels` SET UserID = NULL, Date = NULL, Open = 1 WHERE `UserID` = ?", msg.author.id);
            yield db.run("DELETE FROM VCMembers WHERE ChannelID = ?", userChannel.ChannelID);
            // Check if in vc.
            if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice.channel) !== null && ((_b = msg.member) === null || _b === void 0 ? void 0 : _b.voice.channel.id) == userChannel.ChannelID) {
                // kick from vc
                (_c = msg.member) === null || _c === void 0 ? void 0 : _c.voice.channel.members.forEach(member => {
                    member.voice.kick();
                });
            }
            // Send message
            return msg.reply("voice channel disbanded");
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzYmFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpc2JhbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2IsSUFBSSxFQUFFLFNBQVM7SUFFZixPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDYixXQUFXLEVBQUUscUJBQXFCO0lBQ2xDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNkLEtBQUssRUFBRSxJQUFJO0lBQ1gsU0FBUyxFQUFFLElBQUk7SUFFZixVQUFVLEVBQUU7UUFDUixRQUFRLEVBQUUsRUFBRTtRQUNaLE1BQU0sRUFBRSxDQUFDO0tBQ1o7SUFFSyxPQUFPLENBQUMsR0FBWSxFQUFFLEtBQWUsRUFBRSxFQUFZOzs7WUFDckQseURBQXlEO1lBQ3pELElBQUksV0FBVyxHQUFHLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxrREFBa0QsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ2pHLDBCQUEwQjtZQUMxQixJQUFJLFdBQVcsSUFBSSxTQUFTLEVBQUU7Z0JBQzFCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFBO2FBQ2hFO1lBRUQscUJBQXFCO1lBQ3JCLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxvRkFBb0YsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2xILE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsRUFBRSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUE7WUFFaEYsa0JBQWtCO1lBQ2xCLElBQUksT0FBQSxHQUFHLENBQUMsTUFBTSwwQ0FBRSxLQUFLLENBQUMsT0FBTyxNQUFLLElBQUksSUFBSSxPQUFBLEdBQUcsQ0FBQyxNQUFNLDBDQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUU7Z0JBQzdGLGVBQWU7Z0JBQ2YsTUFBQSxHQUFHLENBQUMsTUFBTSwwQ0FBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3hCLENBQUMsRUFBRTthQUNOO1lBQ0QsZUFBZTtZQUNmLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOztLQUMvQztDQUNKLENBQUMifQ==