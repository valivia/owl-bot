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
const logHandler_1 = __importDefault(require("../middleware/logHandler"));
exports.name = "messageUpdate";
function guildAdd(client) {
    return (oldmsg, newmsg) => __awaiter(this, void 0, void 0, function* () {
        try {
            // check if messaged actually changed.
            if (oldmsg.content === newmsg.content) {
                return;
            }
            // check if there is a message.
            if (oldmsg.content === null) {
                return;
            }
            logHandler_1.default("Message update", oldmsg.content.length !== 0 ? oldmsg.content : "no content", oldmsg.author, 1);
            console.log(`Message update \n from: ${oldmsg.content} \n to: ${newmsg.content}`);
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.default = guildAdd;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZVVwZGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lc3NhZ2VVcGRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMEVBQWtEO0FBRXJDLFFBQUEsSUFBSSxHQUFJLGVBQWUsQ0FBQztBQUdyQyxTQUF3QixRQUFRLENBQUMsTUFBYztJQUUzQyxPQUFPLENBQU8sTUFBZ0MsRUFBRSxNQUFnQyxFQUFFLEVBQUU7UUFDaEYsSUFBSTtZQUNBLHNDQUFzQztZQUN0QyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFBRSxPQUFPO2FBQUU7WUFFbEQsK0JBQStCO1lBQy9CLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxJQUFJLEVBQUU7Z0JBQUUsT0FBTzthQUFFO1lBRXhDLG9CQUFVLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUcsTUFBTSxDQUFDLE1BQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVySCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixNQUFNLENBQUMsT0FBTyxXQUFXLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ3JGO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO0lBQ0wsQ0FBQyxDQUFBLENBQUM7QUFDTixDQUFDO0FBakJELDJCQWlCQyJ9