"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
colors_1.default.enable();
const discord_js_1 = __importDefault(require("discord.js"));
const settings_json_1 = __importDefault(require("../settings.json"));
const fs_1 = __importDefault(require("fs"));
const commandhandler_1 = require("./middleware/commandhandler");
const logHandler_1 = require("./middleware/logHandler");
function discordBot(db) {
    const client = new discord_js_1.default.Client();
    // EVENTS
    client
        .on("ready", () => __awaiter(this, void 0, void 0, function* () {
        if (client.user === null) {
            return;
        }
        // setTimeout(loop, 1000);
        client.db = db;
        yield client.user.setActivity(`for ${client.guilds.cache.size} servers`, {
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        });
        // initiate command list.
        commandhandler_1.getCommands(client);
        // initiate logHandler.
        logHandler_1.fetchChannel(client);
        // Initiate events.
        fs_1.default.promises
            .readdir('./src/events/')
            .then((files) => { var files_1, files_1_1; return __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            try {
                // Loop through files.
                for (files_1 = __asyncValues(files); files_1_1 = yield files_1.next(), !files_1_1.done;) {
                    const file = files_1_1.value;
                    // Check if its a .js file.
                    if (!file.endsWith('.js'))
                        continue;
                    // Import the file.
                    yield Promise.resolve().then(() => __importStar(require(`./events/${file}`))).then((module) => __awaiter(this, void 0, void 0, function* () {
                        const Event = new module.default(client);
                        client.on(module.name, Event);
                        console.log(" > event added: ".magenta + module.name.green);
                    }));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (files_1_1 && !files_1_1.done && (_a = files_1.return)) yield _a.call(files_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }); });
        console.log(` > Client ready, logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`.magenta);
    }))
        .on("disconnect", () => {
        console.warn("Disconnected!");
        process.exit();
    });
    function loop() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(" > Running loop . . .".yellow);
            // loop.
            setTimeout(loop, 300000);
        });
    }
    client.login(settings_json_1.default.Bot.Token);
    return client;
}
exports.default = discordBot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY29yZEJvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpc2NvcmRCb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUE0QjtBQUM1QixnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLDREQUFpQztBQUVqQyxxRUFBd0M7QUFDeEMsNENBQW9CO0FBRXBCLGdFQUEwRDtBQUMxRCx3REFBc0Q7QUFFdEQsU0FBd0IsVUFBVSxDQUFDLEVBQW1CO0lBRWxELE1BQU0sTUFBTSxHQUFHLElBQUksb0JBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUVwQyxTQUFTO0lBRVQsTUFBTTtTQUNELEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBUyxFQUFFO1FBQ3BCLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDckMsMEJBQTBCO1FBQzFCLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2YsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksVUFBVSxFQUFFO1lBQ3JFLElBQUksRUFBRSxXQUFXO1lBQ2pCLEdBQUcsRUFBRSw2Q0FBNkM7U0FDckQsQ0FBQyxDQUFDO1FBRUgseUJBQXlCO1FBQ3pCLDRCQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEIsdUJBQXVCO1FBQ3ZCLHlCQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckIsbUJBQW1CO1FBQ25CLFlBQUUsQ0FBQyxRQUFRO2FBQ1YsT0FBTyxDQUFDLGVBQWUsQ0FBQzthQUN4QixJQUFJLENBQUMsQ0FBTyxLQUFLLEVBQUUsRUFBRTs7O2dCQUNsQixzQkFBc0I7Z0JBQ3RCLEtBQXlCLFVBQUEsY0FBQSxLQUFLLENBQUE7b0JBQW5CLE1BQU0sSUFBSSxrQkFBQSxDQUFBO29CQUNqQiwyQkFBMkI7b0JBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQzt3QkFBRSxTQUFTO29CQUNwQyxtQkFBbUI7b0JBQ25CLE1BQU0sa0RBQU8sWUFBWSxJQUFJLEVBQUUsSUFBRSxJQUFJLENBQUMsQ0FBTyxNQUFNLEVBQUUsRUFBRTt3QkFDbkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUN6QyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2hFLENBQUMsQ0FBQSxDQUFDLENBQUM7aUJBQ047Ozs7Ozs7OztRQUNMLENBQUMsSUFBQSxDQUFDLENBQUE7UUFFRixPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xJLENBQUMsQ0FBQSxDQUFDO1NBQ0QsRUFBRSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM5QixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUE7SUFFTixTQUFlLElBQUk7O1lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QyxRQUFRO1lBQ1IsVUFBVSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3QixDQUFDO0tBQUE7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLHVCQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRWpDLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFyREQsNkJBcURDIn0=