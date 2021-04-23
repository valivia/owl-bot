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
const modules_1 = require("./middleware/modules");
function discordBot(pool) {
    const client = new discord_js_1.default.Client();
    // EVENTS
    client
        .on("ready", () => __awaiter(this, void 0, void 0, function* () {
        if (client.user === null) {
            return;
        }
        // setTimeout(loop, 1000);
        client.conn = pool;
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
    })
        .ws.on("INTERACTION_CREATE", (interaction) => __awaiter(this, void 0, void 0, function* () {
        // console.log(interaction);
        let args = [];
        // loop through arguments.
        for (let index in interaction.data.options) {
            // push argument into list.
            args.push(interaction.data.options[index].value);
        }
        let user;
        let userID = interaction.member !== undefined ? interaction.member.user.id : interaction.user.id;
        // Check if executed from guild.
        if (interaction.guild_id !== undefined) {
            // get member.
            user = yield modules_1.getMember(client, interaction.guild_id, userID);
        }
        else {
            // Get user.
            user = yield modules_1.getUser(client, userID);
        }
        // Execute command.
        let response = user !== undefined ? yield commandhandler_1.runCommand(user, interaction.data.name, args, client) : { type: "content", content: "an error occured" };
        let data;
        if (response.type == "embed") {
            data = {
                type: 4,
                embeds: [response.content]
            };
        }
        else {
            data = {
                type: 4,
                content: response.content !== undefined ? response.content : "an error occured"
            };
        }
        // Respond.
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: { type: 4, data }
        });
    }));
    client.login(settings_json_1.default.Bot.Token);
    return client;
}
exports.default = discordBot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY29yZEJvdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpc2NvcmRCb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUE0QjtBQUM1QixnQkFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRWhCLDREQUEyQztBQUMzQyxxRUFBd0M7QUFDeEMsNENBQW9CO0FBRXBCLGdFQUFzRTtBQUN0RSx3REFBc0Q7QUFHdEQsa0RBQTBEO0FBRTFELFNBQXdCLFVBQVUsQ0FBQyxJQUFnQjtJQUUvQyxNQUFNLE1BQU0sR0FBRyxJQUFJLG9CQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFcEMsU0FBUztJQUVULE1BQU07U0FDRCxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQVMsRUFBRTtRQUNwQixJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQ3JDLDBCQUEwQjtRQUMxQixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxVQUFVLEVBQUU7WUFDckUsSUFBSSxFQUFFLFdBQVc7WUFDakIsR0FBRyxFQUFFLDZDQUE2QztTQUNyRCxDQUFDLENBQUM7UUFFSCx5QkFBeUI7UUFDekIsNEJBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQix1QkFBdUI7UUFDdkIseUJBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQixtQkFBbUI7UUFDbkIsWUFBRSxDQUFDLFFBQVE7YUFDTixPQUFPLENBQUMsZUFBZSxDQUFDO2FBQ3hCLElBQUksQ0FBQyxDQUFPLEtBQUssRUFBRSxFQUFFOzs7Z0JBQ2xCLHNCQUFzQjtnQkFDdEIsS0FBeUIsVUFBQSxjQUFBLEtBQUssQ0FBQTtvQkFBbkIsTUFB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