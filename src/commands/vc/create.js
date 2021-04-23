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
const modules_1 = require("../../middleware/modules");
module.exports = {
    name: "create",
    aliases: [""],
    description: "creates a new priv room.",
    examples: ["create myPrivateRoom"],
    group: "moderator",
    guildOnly: true,
    adminOnly: false,
    slash: true,
    args: [
        {
            "type": "string",
            "name": "channelName",
            "description": "Name of the channel",
            "default": false,
            "required": true
        }
    ],
    throttling: {
        duration: 30,
        usages: 3,
    },
    execute(author, { channelName }, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = client.conn;
            try {
                let options = {
                    type: 'voice',
                    permissionOverwrites: [{
                            id: author.guild.id,
                            allow: ['VIEW_CHANNEL'],
                            deny: ['CONNECT']
                        }]
                };
                // Make channel.
                let channel = yield author.guild.channels.create(channelName, options);
                if (channel === undefined) {
                    return modules_1.defaultErr;
                }
                // Add to db.
                yield conn.query("INSERT INTO `VoiceChannels` (ChannelID) VALUES(?)", [channel.id])
                    .catch(err => {
                    console.log(err);
                    return modules_1.defaultErr;
                });
                // Send message
                return { type: "text", content: "Channel added to db" };
            }
            catch (e) {
                console.log(e);
                return modules_1.defaultErr;
            }
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3JlYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUEsc0RBQXNEO0FBRXRELE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixJQUFJLEVBQUUsUUFBUTtJQUNkLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNiLFdBQVcsRUFBRSwwQkFBMEI7SUFDdkMsUUFBUSxFQUFFLENBQUMsc0JBQXNCLENBQUM7SUFDbEMsS0FBSyxFQUFFLFdBQVc7SUFFbEIsU0FBUyxFQUFFLElBQUk7SUFDZixTQUFTLEVBQUUsS0FBSztJQUNoQixLQUFLLEVBQUUsSUFBSTtJQUVYLElBQUksRUFBRTtRQUNGO1lBQ0ksTUFBTSxFQUFFLFFBQVE7WUFDaEIsTUFBTSxFQUFFLGFBQWE7WUFDckIsYUFBYSxFQUFFLHFCQUFxQjtZQUNwQyxTQUFTLEVBQUUsS0FBSztZQUNoQixVQUFVLEVBQUUsSUFBSTtTQUNuQjtLQUNKO0lBRUQsVUFBVSxFQUFFO1FBQ1IsUUFBUSxFQUFFLEVBQUU7UUFDWixNQUFNLEVBQUUsQ0FBQztLQUNaO0lBRUssT0FBTyxDQUFDLE1BQW1CLEVBQUUsRUFBRSxXQUFXLEVBQTJCLEVBQUUsTUFBYzs7WUFDdkYsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN2QixJQUFJO2dCQUNBLElBQUksT0FBTyxHQUFHO29CQUNWLElBQUksRUFBRSxPQUFPO29CQUNiLG9CQUFvQixFQUFFLENBQUM7NEJBQ25CLEVBQUUsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7NEJBQ25CLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQzs0QkFDdkIsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDO3lCQUNwQixDQUFDO2lCQUNMLENBQUE7Z0JBRUQsZ0JBQWdCO2dCQUNoQixJQUFJLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFpQixDQUFDO2dCQUV2RixJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7b0JBQ3ZCLE9BQU8sb0JBQVUsQ0FBQTtpQkFDcEI7Z0JBRUQsYUFBYTtnQkFDYixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsbURBQW1ELEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQzlFLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNoQixPQUFPLG9CQUFVLENBQUE7Z0JBQ3JCLENBQUMsQ0FBQyxDQUFBO2dCQUVOLGVBQWU7Z0JBQ2YsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLENBQUM7YUFDM0Q7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNmLE9BQU8sb0JBQVUsQ0FBQTthQUNwQjtRQUNMLENBQUM7S0FBQTtDQUNKLENBQUMifQ==