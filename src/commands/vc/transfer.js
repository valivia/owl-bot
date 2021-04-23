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
    execute(msg, args, conn) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pingedUser = args[0];
                let userChannel = yield conn.query("SELECT * FROM `VoiceChannels` WHERE `UserID` = ?", msg.author.id);
                // Check if user has a vc.
                if (userChannel == undefined) {
                    return msg.reply("You dont have an active private voicechat");
                }
                if ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(pingedUser.id)) {
                    // Make vc private.
                    yield conn.query("UPDATE `VoiceChannels` SET Open = 0 WHERE `UserID` = ?", msg.author.id);
                }
                return;
            }
            catch (e) {
                console.log(e);
                return msg.reply("an error occured");
            }
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cmFuc2Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixJQUFJLEVBQUUsVUFBVTtJQUVoQixPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDYixXQUFXLEVBQUUsb0JBQW9CO0lBQ2pDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNkLEtBQUssRUFBRSxJQUFJO0lBQ1gsU0FBUyxFQUFFLElBQUk7SUFDZixRQUFRLEVBQUUsSUFBSTtJQUVkLFVBQVUsRUFBRTtRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osTUFBTSxFQUFFLENBQUM7S0FDWjtJQUVLLE9BQU8sQ0FBQyxHQUFZLEVBQUUsSUFBYyxFQUFFLElBQWdCOzs7WUFDeEQsSUFBSTtnQkFDQSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFTLENBQUM7Z0JBQ25DLElBQUksV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxrREFBa0QsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUNyRywwQkFBMEI7Z0JBQzFCLElBQUksV0FBVyxJQUFJLFNBQVMsRUFBRTtvQkFDMUIsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUE7aUJBQ2hFO2dCQUVELFVBQUksR0FBRyxDQUFDLEtBQUssMENBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRztvQkFFN0MsbUJBQW1CO29CQUNuQixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsd0RBQXdELEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztpQkFDN0Y7Z0JBQ0QsT0FBTzthQUNWO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQzthQUN4Qzs7S0FDSjtDQUNKLENBQUMifQ==