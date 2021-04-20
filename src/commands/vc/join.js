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
    execute(msg, args, db) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
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
            let userChannel = yield db.get(query, pingedUser.id);
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
                yield db.run("INSERT INTO `VCMembers` (UserID, ChannelID, Date) VALUES (?,?,?)", [msg.author.id, userChannel.ChannelID, Date.now()]);
            }));
            collector.on('end', () => {
                return msg.reply("Nobody accepted your request in time.");
            });
            return;
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9pbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImpvaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2IsSUFBSSxFQUFFLE1BQU07SUFFWixPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDYixXQUFXLEVBQUUsbUNBQW1DO0lBQ2hELFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNkLEtBQUssRUFBRSxJQUFJO0lBQ1gsU0FBUyxFQUFFLElBQUk7SUFDZixRQUFRLEVBQUUsSUFBSTtJQUVkLFVBQVUsRUFBRTtRQUNSLFFBQVEsRUFBRSxFQUFFO1FBQ1osTUFBTSxFQUFFLENBQUM7S0FDWjtJQUVLLE9BQU8sQ0FBQyxHQUFZLEVBQUUsSUFBYyxFQUFFLEVBQVk7OztZQUNwRCxNQUFNLFVBQVUsR0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxLQUFLLEdBQ1A7Ozs7YUFJQyxDQUFBO1lBRUwsa0JBQWtCO1lBQ2xCLElBQUksT0FBQSxHQUFHLENBQUMsTUFBTSwwQ0FBRSxLQUFLLENBQUMsT0FBTyxLQUFJLElBQUksRUFBRTtnQkFDbkMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUE7YUFDekQ7WUFFRCw0QkFBNEI7WUFDNUIsSUFBSSxXQUFXLEdBQUcsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckQsaUNBQWlDO1lBQ2pDLElBQUksV0FBVyxJQUFJLFNBQVMsRUFBRTtnQkFDMUIsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUE7YUFDakU7WUFDRCwrR0FBK0c7WUFFL0cseUJBQXlCO1lBQ3pCLElBQUksV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUU7Z0JBQ3ZCLGdCQUFnQjtnQkFDaEIsYUFBTyxHQUFHLENBQUMsTUFBTSwwQ0FBRSxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUU7YUFDOUQ7WUFFRCxvQkFBb0I7WUFDcEIsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXRCLG1CQUFtQjtZQUNuQixNQUFNLE1BQU0sR0FBRyxDQUFDLFFBQXlCLEVBQUUsSUFBVSxFQUFFLEVBQUU7Z0JBQ3JELE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUNyRSxDQUFDLENBQUM7WUFFRixxQkFBcUI7WUFDckIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBRXhFLG9CQUFvQjtZQUNwQixTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxHQUFTLEVBQUU7O2dCQUMvQixxQkFBcUI7Z0JBQ3JCLE1BQUEsR0FBRyxDQUFDLE1BQU0sMENBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO2dCQUNwRCxrQkFBa0I7Z0JBQ2xCLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxrRUFBa0UsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUN4SSxDQUFDLENBQUEsQ0FBQyxDQUFDO1lBR0gsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO2dCQUNyQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQTtZQUM3RCxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU87O0tBQ1Y7Q0FDSixDQUFDIn0=