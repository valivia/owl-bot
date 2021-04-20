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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = exports.getCommands = void 0;
const colors_1 = __importDefault(require("colors"));
colors_1.default.enable();
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const settings_json_1 = __importDefault(require("../../settings.json"));
const options = settings_json_1.default.Options;
function getCommands(client) {
    return __awaiter(this, void 0, void 0, function* () {
        client.commands = new discord_js_1.Collection();
        fs_1.default.readdir(`./src/commands/`, (err, folders) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(`${err}`.red);
            }
            // Loop through folders.
            for (const folder of folders) {
                // Get all files in folder.
                const commandFiles = fs_1.default.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"));
                // Loop through files.
                for (const file of commandFiles) {
                    // Get file.
                    const command = yield Promise.resolve().then(() => __importStar(require(`../commands/${folder}/${file}`)));
                    // Insert command into db if not there yet.
                    yield client.db.run("INSERT OR IGNORE INTO Commands (Name, Disabled, `Group`) VALUES (?,?,?)", [command.name, 0, command.group]).catch((error) => {
                        console.error(error);
                    });
                    // Get command from db.
                    let query = yield client.db.get("SELECT * FROM Commands WHERE Name = ?", command.name);
                    // Set disable status of command.
                    command.disabled = query.Disabled == 1 ? true : false;
                    // Add command to client.
                    client.commands.set(command.name, command);
                    console.log(" > Command added: ".magenta + `${command.disabled ? command.name.red : command.name.green}`);
                }
            }
        }));
    });
}
exports.getCommands = getCommands;
function runCommand(client, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        // Split message into arguments.
        const args = msg.content.slice(options.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        // Loop through arguments and pick out the mentions
        for (let i = 0; i < args.length; i++) {
            const matches = args[i].match(/^<@!?(\d+)>$/);
            if (matches === null) {
                continue;
            }
            args[i] = client.users.cache.get(matches[1]);
        }
        // Try to find the command.
        let cmd = client.commands.get(commandName);
        let cmdAlias = client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        // Define command.
        const command = cmdAlias !== undefined ? cmdAlias : (cmd !== undefined ? cmd : undefined);
        // Check if command exists.
        if (command === undefined) {
            return;
        }
        // Check if command is disabled.
        if (command.disabled && msg.author.id !== options.owner) {
            return;
        }
        // check if admin command.
        if (command.adminOnly && msg.author.id !== options.owner) {
            return;
        }
        // check if in guild.
        if (command.guildOnly && msg.channel.type !== "dm") {
            msg.reply("This command is limited to servers.");
            return;
        }
        // check if argument is required.
        if (command.required && args.length < 1) {
            let reply = `You didn't provide any arguments, ${msg.author}!`;
            if (command.example !== undefined) {
                reply += `\nThe proper usage would be: \`${options.prefix}${command.name} ${command.example}\``;
            }
            msg.channel.send(reply);
            return;
        }
        command.execute(msg, args, client.db);
        return;
    });
}
exports.runCommand = runCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZGhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21tYW5kaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLGdCQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFaEIsMkNBQXlEO0FBQ3pELDRDQUFvQjtBQUVwQix3RUFBMkM7QUFDM0MsTUFBTSxPQUFPLEdBQUcsdUJBQVEsQ0FBQyxPQUFPLENBQUM7QUFFakMsU0FBc0IsV0FBVyxDQUFDLE1BQWM7O1FBQzVDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFDbkMsWUFBRSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFPLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUNqRCxJQUFJLEdBQUcsRUFBRTtnQkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7YUFBRTtZQUN2Qyx3QkFBd0I7WUFDeEIsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7Z0JBQzFCLDJCQUEyQjtnQkFDM0IsTUFBTSxZQUFZLEdBQUcsWUFBRSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3JHLHNCQUFzQjtnQkFDdEIsS0FBSyxNQUFNLElBQUksSUFBSSxZQUFZLEVBQUU7b0JBQzdCLFlBQVk7b0JBQ1osTUFBTSxPQUFPLEdBQUcsd0RBQWEsZUFBZSxNQUFNLElBQUksSUFBSSxFQUFFLEdBQWMsQ0FBQztvQkFDM0UsMkNBQTJDO29CQUMzQyxNQUFNLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLHlFQUF5RSxFQUFFLENBQUMs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