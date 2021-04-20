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
    execute(msg, _args, db) {
        return __awaiter(this, void 0, void 0, function* () {
            let userChannel = yield db.get("SELECT * FROM VoiceChannels WHERE UserID = ?", msg.author.id);
            // Check if user has a vc.
            if (userChannel == undefined) {
                return msg.reply("You dont have an active private voicechat");
            }
            // Make vc private/open
            yield db.run("UPDATE `VoiceChannels` SET Open = ? WHERE `UserID` = ?", [userChannel.Open == 1 ? 0 : 1, msg.author.id]);
            // Notify user.
            return msg.channel.send(`Your voicechannel is now ${userChannel.Open == 1 ? "closed" : "open"}.`);
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpdmF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByaXZhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2IsSUFBSSxFQUFFLFNBQVM7SUFFZixPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDYixXQUFXLEVBQUUsZ0JBQWdCO0lBQzdCLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNkLEtBQUssRUFBRSxJQUFJO0lBQ1gsU0FBUyxFQUFFLElBQUk7SUFFZixVQUFVLEVBQUU7UUFDUixRQUFRLEVBQUUsRUFBRTtRQUNaLE1BQU0sRUFBRSxDQUFDO0tBQ1o7SUFFSyxPQUFPLENBQUMsR0FBWSxFQUFFLEtBQWUsRUFBRSxFQUFZOztZQUNyRCxJQUFJLFdBQVcsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsOENBQThDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUM3RiwwQkFBMEI7WUFDMUIsSUFBSSxXQUFXLElBQUksU0FBUyxFQUFFO2dCQUMxQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQTthQUNoRTtZQUVELHVCQUF1QjtZQUN2QixNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsd0RBQXdELEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRXZILGVBQWU7WUFDZixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDRCQUE0QixXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO1FBQ3JHLENBQUM7S0FBQTtDQUNKLENBQUMifQ==