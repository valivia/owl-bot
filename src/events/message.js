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
exports.name = void 0;
const settings_json_1 = __importDefault(require("../../settings.json"));
const commandhandler_1 = require("../middleware/commandhandler");
const options = settings_json_1.default.Options;
exports.name = "message";
function message(client) {
    return (msg) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // Check if valid channel.
            if (msg.guild === null && msg.channel === null) {
                return;
            }
            // Check if user is not a bot.
            if (msg.author.bot) {
                return;
            }
            ;
            // Check if bot is called with prefix or tag.
            if (!msg.content.startsWith(options.prefix, 0) && !msg.content.startsWith(`<@!${(_a = client.user) === null || _a === void 0 ? void 0 : _a.id}>`)) {
                return;
            }
            let user = msg.member == undefined ? msg.author : msg.member;
            // Split message into arguments.
            const args = msg.content.slice(options.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            // Loop through arguments and pick out the mentions
            for (let i = 0; i < args.length; i++) {
                let matches = undefined;
                matches = args[i].match(/^<@!?(\d+)>$/);
                if (matches == null) {
                    matches = args[i].match(/^<@&?(\d+)>$/);
                }
                if (matches == null) {
                    matches = args[i].match(/^<#?(\d+)>$/);
                }
                if (matches === null) {
                    continue;
                }
                // replace arg with number.
                args[i] = matches[1];
            }
            // yeet through command handler.
            let response = yield commandhandler_1.runCommand(user, commandName, args, client);
            if (response.type === "disabled") {
                return;
            }
            msg.channel.send(response.content);
        }
        catch (error) {
            console.error(error);
            return;
        }
    });
}
exports.default = message;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esd0VBQTJDO0FBQzNDLGlFQUEwRDtBQUUxRCxNQUFNLE9BQU8sR0FBRyx1QkFBUSxDQUFDLE9BQU8sQ0FBQztBQUVwQixRQUFBLElBQUksR0FBRyxTQUFTLENBQUM7QUFFOUIsU0FBd0IsT0FBTyxDQUFDLE1BQWM7SUFFMUMsT0FBTyxDQUFPLEdBQVksRUFBRSxFQUFFOztRQUMxQixJQUFJO1lBQ0EsMEJBQTBCO1lBQzFCLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLE9BQU8sS0FBSyxJQUFJLEVBQUU7Z0JBQUUsT0FBTzthQUFFO1lBRTNELDhCQUE4QjtZQUM5QixJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUFBLENBQUM7WUFFaEMsNkNBQTZDO1lBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxNQUFBLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQUUsT0FBTzthQUFFO1lBRWhILElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBcUIsQ0FBQztZQUU1RSxnQ0FBZ0M7WUFDaEMsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekUsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRS9DLG1EQUFtRDtZQUNuRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbEMsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDO2dCQUN4QixPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO29CQUNqQixPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQTtpQkFDMUM7Z0JBQ0QsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO29CQUNqQixPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtpQkFDekM7Z0JBRUQsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO29CQUFFLFNBQVM7aUJBQUU7Z0JBRW5DLDJCQUEyQjtnQkFDM0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN4QjtZQUVELGdDQUFnQztZQUNoQyxJQUFJLFFBQVEsR0FBRyxNQUFNLDJCQUFVLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakUsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtnQkFDOUIsT0FBTzthQUNWO1lBQ0QsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBRXRDO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLE9BQU87U0FDVjtJQUNMLENBQUMsQ0FBQSxDQUFDO0FBQ04sQ0FBQztBQWhERCwwQkFnREMifQ==