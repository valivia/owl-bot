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
    name: "private",
    aliases: [""],
    description: "toggle privacy",
    examples: [""],
    group: "vc",
    guildOnly: true,
    throttling: {
        duration: 30,
        usages: 3,
    },
    execute(msg, _args, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userChannel = yield conn.query("SELECT * FROM VoiceChannels WHERE UserID = ?", msg.author.id);
                userChannel = userChannel[0];
                // Check if user has a vc.
                if (userChannel == undefined) {
                    return msg.reply("You dont have an active private voicechat");
                }
                // Make vc private/open
                yield conn.query("UPDATE `VoiceChannels` SET Open = ? WHERE `UserID` = ?", [userChannel.Open == 1 ? 0 : 1, msg.author.id]);
                // Notify user.
                return msg.channel.send(`Your voicechannel is now ${userChannel.Open == 1 ? "closed" : "open"}.`);
            }
            catch (e) {
                console.log(e);
                return msg.reply("an error occured");
            }
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpdmF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByaXZhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2IsSUFBSSxFQUFFLFNBQVM7SUFFZixPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDYixXQUFXLEVBQUUsZ0JBQWdCO0lBQzdCLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNkLEtBQUssRUFBRSxJQUFJO0lBQ1gsU0FBUyxFQUFFLElBQUk7SUFFZixVQUFVLEVBQUU7UUFDUixRQUFRLEVBQUUsRUFBRTtRQUNaLE1BQU0sRUFBRSxDQUFDO0tBQ1o7SUFFSyxPQUFPLENBQUMsR0FBWSxFQUFFLEtBQWUsRUFBRSxJQUFnQjs7WUFDekQsSUFBSTtnQkFDQSxJQUFJLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsOENBQThDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDakcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsMEJBQTBCO2dCQUMxQixJQUFJLFdBQVcsSUFBSSxTQUFTLEVBQUU7b0JBQzFCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFBO2lCQUNoRTtnQkFFRCx1QkFBdUI7Z0JBQ3ZCLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyx3REFBd0QsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRTNILGVBQWU7Z0JBQ2YsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTthQUNwRztZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7YUFDeEM7UUFDTCxDQUFDO0tBQUE7Q0FDSixDQUFDIn0=