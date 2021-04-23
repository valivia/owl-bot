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
                        if (command == undefined) {
                            continue;
                        }
                        ;
                        // search for commands with same name.
                        let cmd = client.commands.get(command.name);
                        let cmdAlias = client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command.name));
                        // throw err.
                        if (cmd !== undefined || cmdAlias !== undefined) {
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
            }));
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
        let cmd = client.commands.get(commandName);
        let cmdAlias = client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        // Define command.
        const command = cmdAlias !== undefined ? cmdAlias : (cmd !== undefined ? cmd : undefined);
        // Check if command exists.
        if (command === undefined) {
            return { type: "disabled", content: "command doesnt exist" };
        } // note
        // check if in guild.
        if (command.guildOnly && user.guild == undefined) {
            // Return error.
            return { type: "content", content: "This command is limited to servers." };
        }
        let guild = user.guild;
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
                    value = guild.channels.cache.get(input);
                    break;
                }
                case 8: {
                    value = guild.roles.cache.get(input);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZGhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21tYW5kaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLGdCQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFaEIsMkNBQW1GO0FBQ25GLDRDQUFvQjtBQUVwQix3RUFBMkM7QUFDM0MsdUNBQStDO0FBQy9DLE1BQU0sT0FBTyxHQUFHLHVCQUFRLENBQUMsT0FBTyxDQUFDO0FBRWpDLFNBQXNCLFdBQVcsQ0FBQyxNQUFjOztRQUM1QyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1FBQ25DLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSTtZQUNBLFlBQUUsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBTyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUU7Z0JBQ2pELElBQUksR0FBRyxFQUFFO29CQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFBRTtnQkFDdkMsd0JBQXdCO2dCQUN4QixLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtvQkFDMUIsMkJBQTJCO29CQUMzQixNQUFNLFlBQVksR0FBRyxZQUFFLENBQUMsV0FBVyxDQUFDLGtCQUFrQixNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDckcsc0JBQXNCO29CQUN0QixLQUFLLE1BQU0sSUFBSSxJQUFJLFlBQVksRUFBRTt3QkFDN0IsWUFBWTt3QkFDWixNQUFNLE9BQU8sR0FBRyx3REFBYSxlQUFlLE1BQU0sSUFBSSxJQUFJLEVBQUUsR0FBYyxDQUFDO3dCQUMz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