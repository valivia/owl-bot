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
    name: "create",
    aliases: [""],
    description: "create a private vc",
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
            let name = args.join(" ").toLowerCase();
            let options = {
                type: 'voice',
                permissionOverwrites: [{
                        id: msg.guild.id,
                        allow: ['VIEW_CHANNEL'],
                        deny: ['CONNECT']
                    }]
            };
            // Make channel.
            let channel = yield ((_a = msg.guild) === null || _a === void 0 ? void 0 : _a.channels.create(name, options));
            if (channel == undefined) {
                return msg.reply("an error occurred.");
            }
            // Add to db.
            db.run("INSERT INTO `VoiceChannels` (ChannelID) VALUES(?)", [channel.id]);
            // Send message
            return msg.reply("Channel added to database.");
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNiLElBQUksRUFBRSxRQUFRO0lBRWQsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ2IsV0FBVyxFQUFFLHFCQUFxQjtJQUNsQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDZCxLQUFLLEVBQUUsSUFBSTtJQUNYLFNBQVMsRUFBRSxJQUFJO0lBQ2YsUUFBUSxFQUFFLElBQUk7SUFFZCxVQUFVLEVBQUU7UUFDUixRQUFRLEVBQUUsRUFBRTtRQUNaLE1BQU0sRUFBRSxDQUFDO0tBQ1o7SUFFSyxPQUFPLENBQUMsR0FBWSxFQUFFLElBQWMsRUFBRSxFQUFZOzs7WUFDcEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN4QyxJQUFJLE9BQU8sR0FBRztnQkFDVixJQUFJLEVBQUUsT0FBTztnQkFDYixvQkFBb0IsRUFBRSxDQUFDO3dCQUNuQixFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUNoQixLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUM7d0JBQ3ZCLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQztxQkFDcEIsQ0FBQzthQUNMLENBQUE7WUFFRCxnQkFBZ0I7WUFDaEIsSUFBSSxPQUFPLEdBQUcsYUFBTSxHQUFHLENBQUMsS0FBSywwQ0FBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQWlCLENBQUM7WUFFOUUsSUFBSSxPQUFPLElBQUksU0FBUyxFQUFHO2dCQUN2QixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQzthQUMxQztZQUVELGFBQWE7WUFDYixFQUFFLENBQUMsR0FBRyxDQUFDLG1EQUFtRCxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFFekUsZUFBZTtZQUNmLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztLQUNsRDtDQUNKLENBQUMifQ==