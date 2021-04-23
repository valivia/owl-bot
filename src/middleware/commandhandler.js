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
const modules_1 = require("./modules");
const options = settings_json_1.default.Options;
function getCommands(client) {
    return __awaiter(this, void 0, void 0, function* () {
        client.commands = new discord_js_1.Collection();
        let conn = client.conn;
        try {
            // get folders.
            let folders = yield fs_1.default.readdirSync("./src/commands/");
            // Loop through folders.
            for (const folder of folders) {
                // Get all files in folder.
                const commandFiles = fs_1.default.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"));
                // Loop through files.
                for (const file of commandFiles) {
                    // Get file.
                    const command = yield Promise.resolve().then(() => __importStar(require(`../commands/${folder}/${file}`)));
                    if (command == undefined) {
                        continue;
                    }
                    ;
                    // search for commands with same name.
                    let cmd = modules_1.getCommand(client, command.name);
                    // throw err.
                    if (cmd !== undefined) {
                        console.log(`duplicate commands with name: ${command.name}`.red.bold);
                        process.exit();
                    }
                    // loop through arguments.
                    for (const type in command.args) {
                        let x;
                        // set int of type;
                        switch (command.args[type].type) {
                            case "string":
                                x = 3;
                                break;
                            case "integer":
                                x = 4;
                                break;
                            case "boolean":
                                x = 5;
                                break;
                            case "user":
                                x = 6;
                                break;
                            case "channel":
                                x = 7;
                                break;
                            case "role":
                                x = 8;
                                break;
                            default: {
                                console.log(`${command.args[type].type} is an invalid arg type at ${command.name}`.red.bold);
                                process.exit();
                            }
                        }
                        command.args[type].type = x;
                    }
                    // Get command from db.
                    let query = yield conn.query("SELECT * FROM Commands WHERE Name = ?", command.name);
                    query = query[0];
                    if (query === undefined && command.slash) {
                        client.api.applications(client.user.id).commands.post({
                            data: {
                                name: command.name,
                                description: command.description,
                                options: command.args
                            }
                        });
                        console.log(`${command.name} has been added as slash command.`);
                    }
                    // Insert command into db if not there yet.
                    yield conn.query("INSERT IGNORE INTO Commands (Name, Disabled, `Group`) VALUES (?,?,?)", [command.name, false, command.group]).catch((error) => {
                        console.error(error);
                    });
                    // Set disable status of command.
                    command.disabled = (query === null || query === void 0 ? void 0 : query.Disabled) ? true : false;
                    // Add command to client.
                    client.commands.set(command.name, command);
                    // Log.
                    console.log(" > Command added: ".magenta + `${command.disabled ? command.name.red : command.name.green}`);
                }
            }
        }
        catch (err) {
            throw err;
        }
    });
}
exports.getCommands = getCommands;
function runCommand(user, commandName, args, client) {
    return __awaiter(this, void 0, void 0, function* () {
        // Try to find the command.
        let command = modules_1.getCommand(client, commandName);
        // Check if command exists.
        if (command === undefined) {
            return { type: "disabled", content: "command doesnt exist" };
        }
        // check if in guild.
        if (command.guildOnly && !("user" in user)) {
            // Return error.
            return { type: "content", content: "This command is limited to servers." };
        }
        let guild = "user" in user ? user.guild : undefined;
        // check if admin command.
        if (command.adminOnly && user.id !== options.owner) {
            // Return error.
            return { type: "disabled", content: "This command is only available for admins" };
        }
        // Check if command is disabled.
        if (command.disabled && user.id !== options.owner) {
            // Return error.
            return { type: "content", content: "This command is currently disabled." };
        }
        // Call fun if it doesnt have args.
        if (command.args === undefined) {
            return yield command.execute(user, undefined, client);
        }
        let commandArgs = {};
        for (let index in command.args) {
            let value;
            let arg = command.args[index];
            let input = args[index];
            if (input === undefined && arg.required) {
                // Return error.
                return { type: "content", content: `Incorrect command usage, missing the ${arg.name} variable` };
            }
            // Checks which data type it is and converts it into the right one.
            switch (arg.type) {
                case 3:
                    value = input;
                    break;
                case 4: {
                    value = Number(input);
                    if (!Number.isFinite(value)) {
                        return { type: "content", content: "Incorrect command usage, not an integer." };
                    }
                    break;
                }
                case 5: break;
                case 6: {
                    if (guild === undefined) {
                        value = yield modules_1.getUser(client, input);
                    }
                    else {
                        value = yield modules_1.getMember(client, guild.id, input);
                    }
                    break;
                }
                case 7: {
                    if (guild === undefined) {
                        return modules_1.defaultErr;
                    }
                    value = yield modules_1.getChannel(client, guild.id, input);
                    break;
                }
                case 8: {
                    if (guild === undefined) {
                        return modules_1.defaultErr;
                    }
                    value = modules_1.getRole(client, guild.id, input);
                    break;
                }
                default: throw "invalid type.";
            }
            commandArgs[arg.name] = value;
            continue;
        }
        return yield command.execute(user, commandArgs, client);
    });
}
exports.runCommand = runCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZGhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21tYW5kaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLGdCQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFaEIsMkNBQW1FO0FBQ25FLDRDQUFvQjtBQUVwQix3RUFBMkM7QUFDM0MsdUNBQTRGO0FBQzVGLE1BQU0sT0FBTyxHQUFHLHVCQUFRLENBQUMsT0FBTyxDQUFDO0FBRWpDLFNBQXNCLFdBQVcsQ0FBQyxNQUFjOztRQUM1QyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1FBQ25DLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSTtZQUNBLGVBQWU7WUFDZixJQUFJLE9BQU8sR0FBRyxNQUFNLFlBQUUsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUN0RCx3QkFBd0I7WUFDeEIsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7Z0JBQzFCLDJCQUEyQjtnQkFDM0IsTUFBTSxZQUFZLEdBQUcsWUFBRSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3JHLHNCQUFzQjtnQkFDdEIsS0FBSyxNQUFNLElBQUksSUFBSSxZQUFZLEVBQUU7b0JBQzdCLFlBQVk7b0JBQ1osTUFBTSxPQUFPLEdBQUcsd0RBQWEsZUFBZSxNQUFNLElBQUksSUFBSSxFQUFFLEdBQWMsQ0FBQztvQkFDM0UsSUFBSSxPQUFPLElBQUksU0FBUyxFQUFFO3dCQUFFLFNBQVE7cUJBQUU7b0JBQUEsQ0FBQztvQkFFdkMsc0NBQXNDO29CQUN0QyxJQUFJLEdBQUcs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