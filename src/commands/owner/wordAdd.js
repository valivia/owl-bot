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
const discord_js_1 = require("discord.js");
module.exports = {
    name: "addword",
    adminOnly: true,
    aliases: ["aw"],
    description: "adds a word to the filter.",
    example: ["bitch"],
    group: "moderator",
    memberName: "addword",
    required: true,
    guildOnly: false,
    throttling: {
        amount: 2,
        time: 10,
    },
    execute(msg, args, db) {
        return __awaiter(this, void 0, void 0, function* () {
            let reason = args.join(" ").toLowerCase();
            let query = "INSERT OR IGNORE INTO WORDFILTER (WORD, DATE) VALUES(?, ?);";
            try {
                //insert into database.
                yield db.run(query, [
                    reason,
                    Date.now()
                ]);
                loadList(msg.client);
                // send message.
                const success = new discord_js_1.MessageEmbed()
                    .addField("success", (`added word to database.`))
                    .setColor("#559b0f")
                    .setTimestamp();
                msg.channel.send(success);
            }
            catch (e) {
                // log error.
                console.log(e);
                // notify user about failure.
                const FailEmbed = new discord_js_1.MessageEmbed()
                    .addField("***Failed***", (`An error has occured`))
                    .setColor("#F50303")
                    .setTimestamp();
                msg.channel.send(FailEmbed);
                return;
            }
        });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29yZEFkZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndvcmRBZGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBbUQ7QUFHbkQsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNiLElBQUksRUFBRSxTQUFTO0lBRWYsU0FBUyxFQUFFLElBQUk7SUFDZixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDZixXQUFXLEVBQUUsNEJBQTRCO0lBQ3pDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUNsQixLQUFLLEVBQUUsV0FBVztJQUNsQixVQUFVLEVBQUUsU0FBUztJQUNyQixRQUFRLEVBQUUsSUFBSTtJQUNkLFNBQVMsRUFBRSxLQUFLO0lBRWhCLFVBQVUsRUFBRTtRQUNSLE1BQU0sRUFBRSxDQUFDO1FBQ1QsSUFBSSxFQUFFLEVBQUU7S0FDWDtJQUVLLE9BQU8sQ0FBQyxHQUFZLEVBQUUsSUFBYyxFQUFFLEVBQVk7O1lBQ3BELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFMUMsSUFBSSxLQUFLLEdBQUcsNkRBQTZELENBQUM7WUFFMUUsSUFBSTtnQkFDQSx1QkFBdUI7Z0JBQ3ZCLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUU7b0JBQ2hCLE1BQU07b0JBQ04sSUFBSSxDQUFDLEdBQUcsRUFBRTtpQkFDYixDQUFDLENBQUE7Z0JBRUYsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFFckIsZ0JBQWdCO2dCQUNoQixNQUFNLE9BQU8sR0FBRyxJQUFJLHlCQUFZLEVBQUU7cUJBQzdCLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO3FCQUNoRCxRQUFRLENBQUMsU0FBUyxDQUFDO3FCQUNuQixZQUFZLEVBQUUsQ0FBQztnQkFDcEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFFN0I7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixhQUFhO2dCQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWYsNkJBQTZCO2dCQUM3QixNQUFNLFNBQVMsR0FBRyxJQUFJLHlCQUFZLEVBQUU7cUJBQ25DLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO3FCQUNsRCxRQUFRLENBQUMsU0FBUyxDQUFDO3FCQUNuQixZQUFZLEVBQUUsQ0FBQztnQkFFcEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRTVCLE9BQU87YUFDTjtRQUNMLENBQUM7S0FBQTtDQUNKLENBQUMifQ==