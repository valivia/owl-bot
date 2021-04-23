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
    name: "join",
    aliases: [""],
    description: "Join someone else's private room.",
    examples: [""],
    group: "vc",
    guildOnly: true,
    required: true,
    throttling: {
        duration: 30,
        usages: 3,
    },
    execute(msg, args, conn) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pingedUser = args[0];
                const query = `   SELECT VCMembers.UserID, VCMembers.ChannelID, Open, VoiceCHannels.UserID AS OwnerID
                FROM VCMembers
                INNER JOIN VoiceChannels ON VoiceChannels.ChannelID = VCMembers.ChannelID
                WHERE VCMembers.UserID = ?
            `;
                // Check if in vc.
                if (((_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice.channel) == null) {
                    return msg.reply("Please join a voice channel first.");
                }
                // Query db for pinged user.
                let userChannel = yield conn.query(query, pingedUser.id);
                // Check if user is part of a vc.
                if (userChannel == undefined) {
                    return msg.reply("This person is not part of a private room.");
                }
                // let channelMembers = await db.all("SELECT * FROM `VCMembers` WHERE `ChannelID` = ?", userChannel.ChannelID);
                // Check if room is open.
                if (userChannel.Open == 1) {
                    // Drag user in.
                    return (_b = msg.member) === null || _b === void 0 ? void 0 : _b.voice.setChannel(userChannel.ChannelID);
                }
                // React with emote.
                yield msg.react("✔️");
                // Reaction filter.
                const filter = (reaction, user) => {
                    return reaction.emoji.name === "✔️" && user.id === pingedUser.id;
                };
                // Initiate collector
                const collector = msg.createReactionCollector(filter, { time: 120000 });
                // Emote gets added.
                collector.on('collect', () => __awaiter(this, void 0, void 0, function* () {
                    var _c;
                    // move user into vc.
                    (_c = msg.member) === null || _c === void 0 ? void 0 : _c.voice.setChannel(userChannel.ChannelID);
                    // Add user to db.
                    yield conn.query("INSERT INTO `VCMembers` (UserID, ChannelID, Date) VALUES (?,?,?)", [msg.author.id, userChannel.ChannelID, Date.now()]);
                }));
                collector.on('end', () => {
                    return msg.reply("Nobody accepted your request in time.");
                });
                return;
            }
            catch (e) {
                console.log(e);
                return msg.reply("an error occured");
            }
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9pbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImpvaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2IsSUFBSSxFQUFFLE1BQU07SUFFWixPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDYixXQUFXLEVBQUUsbUNBQW1DO0lBQ2hELFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNkLEtBQUssRUFBRSxJQUFJO0lBQ1gsU0FBUyxFQUFFLElBQUk7SUFDZixRQUFRLEVBQUUsSUFBSTtJQUVkLFVBQVUsRUFBRTtRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osTUFBTSxFQUFFLENBQUM7S0FDWjtJQUVLLE9BQU8sQ0FBQyxHQUFZLEVBQUUsSUFBYyxFQUFFLElBQWdCOzs7WUFDeEQsSUFBSTtnQkFDQSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFTLENBQUM7Z0JBQ25DLE1BQU0sS0FBSyxHQUNQOzs7O2FBSUgsQ0FBQTtnQkFFRCxrQkFBa0I7Z0JBQ2xCLElBQUksT0FBQSxHQUFHLENBQUMsTUFBTSwwQ0FBRSxLQUFLLENBQUMsT0FBTyxLQUFJLElBQUksRUFBRTtvQkFDbkMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUE7aUJBQ3pEO2dCQUVELDRCQUE0QjtnQkFDNUIsSUFBSSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3pELGlDQUFpQztnQkFDakMsSUFBSSxXQUFXLElBQUksU0FBUyxFQUFFO29CQUMxQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQTtpQkFDakU7Z0JBQ0QsK0dBQStHO2dCQUUvRyx5QkFBeUI7Z0JBQ3pCLElBQUksV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUU7b0JBQ3ZCLGdCQUFnQjtvQkFDaEIsYUFBTyxHQUFHLENBQUMsTUFBTSwwQ0FBRSxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7aUJBQzlEO2dCQUVELG9CQUFvQjtnQkFDcEIsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV0QixtQkFBbUI7Z0JBQ25CLE1BQU0sTUFBTSxHQUFHLENBQUMsUUFBeUIsRUFBRSxJQUFVLEVBQUUsRUFBRTtvQkFDckQsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxVQUFVLENBQUMsRUFBRSxDQUFDO2dCQUNyRSxDQUFDLENBQUM7Z0JBRUYscUJBQXFCO2dCQUNyQixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsdUJBQXVCLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBRXhFLG9CQUFvQjtnQkFDcEIsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBUyxFQUFFOztvQkFDL0IscUJBQXFCO29CQUNyQixNQUFBLEdBQUcsQ0FBQyxNQUFNLDBDQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTtvQkFDcEQsa0JBQWtCO29CQUNsQixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsa0VBQWtFLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQzVJLENBQUMsQ0FBQSxDQUFDLENBQUM7Z0JBR0gsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO29CQUNyQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQTtnQkFDN0QsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTzthQUNWO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQzthQUN4Qzs7S0FDSjtDQUNKLENBQUMifQ==