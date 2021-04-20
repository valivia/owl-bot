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
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const discordBot_1 = __importDefault(require("./src/discordBot"));
sqlite_1.open({
    driver: sqlite3_1.default.Database,
    filename: "./database.db"
}).then((db) => __awaiter(void 0, void 0, void 0, function* () {
    discordBot_1.default(db);
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQThCO0FBQzlCLHNEQUE4QjtBQUM5QixrRUFBb0M7QUFFcEMsYUFBSSxDQUFDO0lBQ0gsTUFBTSxFQUFFLGlCQUFPLENBQUMsUUFBUTtJQUN4QixRQUFRLEVBQUUsZUFBZTtDQUUxQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQU8sRUFBRSxFQUFFLEVBQUU7SUFDbkIsb0JBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNYLENBQUMsQ0FBQSxDQUFDLENBQUMifQ==