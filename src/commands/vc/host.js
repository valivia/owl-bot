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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logHandler_1 = __importDefault(require("../../middleware/logHandler"));
module.exports = {
    name: "host",
    aliases: [""],
    description: "creates a private room.",
    examples: [""],
    group: "vc",
    guildOnly: true,
    throttling: {
        duration: 30,
        usages: 1,
    },
    execute(msg, _args, conn) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if in vc.
                if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice.channel) == null) {
                    return msg.reply("Please join a voice channel first.");
                }
                // Query db for user's active vcs.
                let userChannel = yield conn.query("SELECT * FROM VoiceChannels WHERE `UserID` = ?", msg.author.id);
                userChannel = userChannel[0];
                if (userChannel !== undefined) {
                    // Move user into vc.
                    msg.member.voice.setChannel(userChannel.ChannelID);
                    // Send message.
                    return msg.reply("moved back into your vc");
                }
                // Query open voicechannels
                let openChannels = yield conn.query("SELECT * FROM VoiceChannels WHERE `UserID` IS NULL");
                openChannels = openChannels[0];
                // Check if available channels.
                if (openChannels === undefined || openChannels.length == 0) {
                    return msg.reply("There are no more private rooms available.");
                }
                // Update db.
                yield conn.query("UPDATE VoiceChannels SET UserID = ?, Date = ? WHERE ChannelID = ?", [msg.author.id, Date.now(), openChannels.ChannelID]);
                // Add user to db.
                yield conn.query("INSERT INTO VCMembers (UserID, ChannelID, Date) VALUES (?,?,?)", [msg.author.id, openChannels.ChannelID, Date.now()]);
                // Move user into private vc.
                msg.member.voice.setChannel(openChannels.ChannelID);
                // Log
                logHandler_1.default("vc assigned", "a vc was assigned", msg.author, 0);
                // Make embed
                const success = new discord_js_1.MessageEmbed()
                    .addField("Success", (`Successfully assigned a voice channel`))
                    .setColor("#559b0f")
                    .setTimestamp();
                // Send message.
                return msg.channel.send(success);
            }
            catch (e) {
                console.log(e);
                return msg.reply("an error occured");
            }
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBbUQ7QUFFbkQsNkVBQXFEO0FBQ3JELE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixJQUFJLEVBQUUsTUFBTTtJQUVaLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNiLFdBQVcsRUFBRSx5QkFBeUI7SUFDdEMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ2QsS0FBSyxFQUFFLElBQUk7SUFDWCxTQUFTLEVBQUUsSUFBSTtJQUVmLFVBQVUsRUFBRTtRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osTUFBTSxFQUFFLENBQUM7S0FDWjtJQUVLLE9BQU8sQ0FBQyxHQUFZLEVBQUUsS0FBZSxFQUFFLElBQWdCOzs7WUFDekQsSUFBSTtnQkFDQSxrQkFBa0I7Z0JBQ2xCLElBQUksT0FBQSxHQUFHLENBQUMsTUFBTSwwQ0FBRSxLQUFLLENBQUMsT0FBTyxLQUFJLElBQUksRUFBRTtvQkFDbkMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUE7aUJBQ3pEO2dCQUVELGtDQUFrQztnQkFDbEMsSUFBSSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3BHLFdBQVcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRTdCLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtvQkFDM0IscUJBQXFCO29CQUNyQixHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNuRCxnQkFBZ0I7b0JBQ2hCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2lCQUMvQztnQkFFRCwyQkFBMkI7Z0JBQzNCLElBQUksWUFBWSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO2dCQUMxRixZQUFZLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUvQiwrQkFBK0I7Z0JBQy9CLElBQUksWUFBWSxLQUFLLFNBQVMsSUFBSSxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtvQkFDeEQsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUE7aUJBQ2pFO2dCQUVELGFBQWE7Z0JBQ2IsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLG1FQUFtRSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUUzSSxrQkFBa0I7Z0JBQ2xCLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxnRUFBZ0UsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFlBQVksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFeEksNkJBQTZCO2dCQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUVwRCxNQUFNO2dCQUNOLG9CQUFVLENBQUMsYUFBYSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRTlELGFBQWE7Z0JBQ2IsTUFBTSxPQUFPLEdBQUcsSUFBSSx5QkFBWSxFQUFFO3FCQUM3QixRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsdUNBQXVDLENBQUMsQ0FBQztxQkFDOUQsUUFBUSxDQUFDLFNBQVMsQ0FBQztxQkFDbkIsWUFBWSxFQUFFLENBQUM7Z0JBRXBCLGdCQUFnQjtnQkFDaEIsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNwQztZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7YUFDeEM7O0tBQ0o7Q0FDSixDQUFDIn0=