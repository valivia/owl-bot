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
    name: "transfer",
    aliases: [""],
    description: "trasnfer ownership",
    examples: [""],
    group: "vc",
    guildOnly: true,
    required: true,
    throttling: {
        duration: 30,
        usages: 3,
    },
    execute(msg, args, db) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const pingedUser = args[0];
            let userChannel = yield db.get("SELECT * FROM `VoiceChannels` WHERE `UserID` = ?", msg.author.id);
            // Check if user has a vc.
            if (userChannel == undefined) {
                return msg.reply("You dont have an active private voicechat");
            }
            if ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(pingedUser.id))
                // Make vc private.
                yield db.run("UPDATE `VoiceChannels` SET Open = 0 WHERE `UserID` = ?", msg.author.id);
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cmFuc2Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixJQUFJLEVBQUUsVUFBVTtJQUVoQixPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDYixXQUFXLEVBQUUsb0JBQW9CO0lBQ2pDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNkLEtBQUssRUFBRSxJQUFJO0lBQ1gsU0FBUyxFQUFFLElBQUk7SUFDZixRQUFRLEVBQUUsSUFBSTtJQUVkLFVBQVUsRUFBRTtRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osTUFBTSxFQUFFLENBQUM7S0FDWjtJQUVLLE9BQU8sQ0FBQyxHQUFZLEVBQUUsSUFBYyxFQUFFLEVBQVk7OztZQUNwRCxNQUFNLFVBQVUsR0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxXQUFXLEdBQUcsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDakcsMEJBQTBCO1lBQzFCLElBQUksV0FBVyxJQUFJLFNBQVMsRUFBRTtnQkFDMUIsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUE7YUFDaEU7WUFFRCxVQUFJLEdBQUcsQ0FBQyxLQUFLLDBDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUU5QyxtQkFBbUI7Z0JBQ25CLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyx3REFBd0QsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztLQUN6RjtDQUNKLENBQUMifQ==