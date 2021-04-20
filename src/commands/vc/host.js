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
    execute(msg, _args, db) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Check if in vc.
            if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice.channel) == null) {
                return msg.reply("Please join a voice channel first.");
            }
            // Query db for user's active vcs.
            const userChannel = yield db.get("SELECT * FROM VoiceChannels WHERE `UserID` = ?", msg.author.id);
            if (userChannel !== undefined) {
                // Move user into vc.
                msg.member.voice.setChannel(userChannel.ChannelID);
                // Send message.
                return msg.reply("moved back into your vc");
            }
            // Query open voicechannels
            const openChannels = yield db.all("SELECT * FROM VoiceChannels WHERE `UserID` IS NULL");
            // Check if available channels.
            if (openChannels.length == 0) {
                return msg.reply("There are no more private rooms available.");
            }
            // Update db.
            yield db.run("UPDATE VoiceChannels SET UserID = ?, Date = ? WHERE ChannelID = ?", [msg.author.id, Date.now(), openChannels[0].ChannelID]);
            // Add user to db.
            yield db.run("INSERT INTO VCMembers (UserID, ChannelID, Date) VALUES (?,?,?)", [msg.author.id, openChannels[0].ChannelID, Date.now()]);
            // Move user into private vc.
            msg.member.voice.setChannel(openChannels[0].ChannelID);
            // Log
            logHandler_1.default("vc assigned", "a vc was assigned", msg.author, 0);
            // Make embed
            const success = new discord_js_1.MessageEmbed()
                .addField("Success", (`Successfully assigned a voice channel`))
                .setColor("#559b0f")
                .setTimestamp();
            // Send message.
            return msg.channel.send(success);
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBbUQ7QUFFbkQsNkVBQXFEO0FBQ3JELE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixJQUFJLEVBQUUsTUFBTTtJQUVaLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNiLFdBQVcsRUFBRSx5QkFBeUI7SUFDdEMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ2QsS0FBSyxFQUFFLElBQUk7SUFDWCxTQUFTLEVBQUUsSUFBSTtJQUVmLFVBQVUsRUFBRTtRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osTUFBTSxFQUFFLENBQUM7S0FDWjtJQUVLLE9BQU8sQ0FBQyxHQUFZLEVBQUUsS0FBZSxFQUFFLEVBQVk7OztZQUVyRCxrQkFBa0I7WUFDbEIsSUFBSSxPQUFBLEdBQUcsQ0FBQyxNQUFNLDBDQUFFLEtBQUssQ0FBQyxPQUFPLEtBQUksSUFBSSxFQUFFO2dCQUNuQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQTthQUN6RDtZQUVELGtDQUFrQztZQUNsQyxNQUFNLFdBQVcsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVsRyxJQUFLLFdBQVcsS0FBSyxTQUFTLEVBQUU7Z0JBQzVCLHFCQUFxQjtnQkFDckIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbkQsZ0JBQWdCO2dCQUNoQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQzthQUMvQztZQUVELDJCQUEyQjtZQUMzQixNQUFNLFlBQVksR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsb0RBQW9ELENBQUMsQ0FBQztZQUV4RiwrQkFBK0I7WUFDL0IsSUFBSSxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDMUIsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUE7YUFDakU7WUFFRCxhQUFhO1lBQ2IsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLG1FQUFtRSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1lBRXpJLGtCQUFrQjtZQUNsQixNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsZ0VBQWdFLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFFdEksNkJBQTZCO1lBQzdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFdkQsTUFBTTtZQUNOLG9CQUFVLENBQUMsYUFBYSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFOUQsYUFBYTtZQUNiLE1BQU0sT0FBTyxHQUFHLElBQUkseUJBQVksRUFBRTtpQkFDakMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7aUJBQzlELFFBQVEsQ0FBQyxTQUFTLENBQUM7aUJBQ25CLFlBQVksRUFBRSxDQUFDO1lBRWhCLGdCQUFnQjtZQUNoQixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztLQUNwQztDQUNKLENBQUMifQ==