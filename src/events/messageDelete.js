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
exports.name = "messageDelete";
function messageDelete() {
    return (msg) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            if ((_a = msg.author) === null || _a === void 0 ? void 0 : _a.bot) {
                return;
            }
            ;
            if (msg.content === null) {
                return;
            }
            logHandler_1.default("Message deleted", ((_b = msg.content) === null || _b === void 0 ? void 0 : _b.length) !== 0 ? msg.content : "image", msg.author, 1);
            console.log(`message deleted from ${(_c = msg.author) === null || _c === void 0 ? void 0 : _c.id}: ${msg.content}`);
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.default = messageDelete;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZURlbGV0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lc3NhZ2VEZWxldGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMEVBQWtEO0FBRXJDLFFBQUEsSUFBSSxHQUFJLGVBQWUsQ0FBQztBQUVyQyxTQUF3QixhQUFhO0lBRWpDLE9BQU8sQ0FBTyxHQUE2QixFQUFFLEVBQUU7O1FBQzNDLElBQUk7WUFDQSxVQUFJLEdBQUcsQ0FBQyxNQUFNLDBDQUFFLEdBQUcsRUFBRTtnQkFBRSxPQUFPO2FBQUU7WUFBQSxDQUFDO1lBQ2pDLElBQUksR0FBRyxDQUFDLE9BQU8sS0FBSyxJQUFJLEVBQUU7Z0JBQUUsT0FBTzthQUFFO1lBQ3JDLG9CQUFVLENBQUMsaUJBQWlCLEVBQUUsT0FBQSxHQUFHLENBQUMsT0FBTywwQ0FBRSxNQUFNLE1BQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE1BQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUV4RyxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixNQUFBLEdBQUcsQ0FBQyxNQUFNLDBDQUFFLEVBQUUsS0FBSyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUN6RTtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsQjtJQUNMLENBQUMsQ0FBQSxDQUFDO0FBQ04sQ0FBQztBQWJELGdDQWFDIn0=