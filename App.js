"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discordBot_1 = __importDefault(require("./src/discordBot"));
const mariadb_1 = __importDefault(require("mariadb"));
const settings_json_1 = __importDefault(require("./settings.json"));
mariadb_1.default.createConnection(settings_json_1.default.db).then(conn => {
    discordBot_1.default(conn);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQW9DO0FBQ3BDLHNEQUF5QjtBQUN6QixvRUFBc0M7QUFFdEMsaUJBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUN6QyxvQkFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2YsQ0FBQyxDQUFDLENBQUEifQ==