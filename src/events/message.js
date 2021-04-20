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
            // yeet through command handler.
            commandhandler_1.runCommand(client, msg);
        }
        catch (error) {
            console.error(error);
            return;
        }
    });
}
exports.default = message;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esd0VBQTJDO0FBQzNDLGlFQUEwRDtBQUUxRCxNQUFNLE9BQU8sR0FBRyx1QkFBUSxDQUFDLE9BQU8sQ0FBQztBQUVwQixRQUFBLElBQUksR0FBSSxTQUFTLENBQUM7QUFFL0IsU0FBd0IsT0FBTyxDQUFDLE1BQWM7SUFFMUMsT0FBTyxDQUFPLEdBQVksRUFBRSxFQUFFOztRQUMxQixJQUFJO1lBQ0EsMEJBQTBCO1lBQzFCLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLE9BQU8sS0FBSyxJQUFJLEVBQUU7Z0JBQUUsT0FBTzthQUFFO1lBRTNELDhCQUE4QjtZQUM5QixJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUFFLE9BQU87YUFBRTtZQUFBLENBQUM7WUFFaEMsNkNBQTZDO1lBQzdDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxNQUFBLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQUUsT0FBTzthQUFFO1lBRWhILGdDQUFnQztZQUNoQywyQkFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztTQUUzQjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixPQUFPO1NBQ1Y7SUFDTCxDQUFDLENBQUEsQ0FBQztBQUNOLENBQUM7QUFyQkQsMEJBcUJDIn0=