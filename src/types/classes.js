"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwlCollection = exports.OwlClient = exports.Command = void 0;
const discord_js_1 = require("discord.js");
class Command {
    constructor(client, info) {
        this.client = client;
        this.aliases = [""];
        this.guildOnly = false;
        this.adminOnly = false;
        this.slash = false;
        this.client = client;
        Object.assign(this, info);
    }
}
exports.Command = Command;
class OwlClient extends discord_js_1.Client {
}
exports.OwlClient = OwlClient;
class OwlCollection extends discord_js_1.Collection {
}
exports.OwlCollection = OwlCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3Nlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsYXNzZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQTRFO0FBRzVFLE1BQXNCLE9BQU87SUFDekIsWUFBMEIsTUFBaUIsRUFBRSxJQUFpQjtRQUFwQyxXQUFNLEdBQU4sTUFBTSxDQUFXO1FBTXBDLFlBQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBS2YsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRWxCLFVBQUssR0FBRyxLQUFLLENBQUM7UUFiakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztDQW9CSjtBQXhCRCwwQkF3QkM7QUFFRCxNQUFhLFNBQVUsU0FBUSxtQkFBTTtDQUdwQztBQUhELDhCQUdDO0FBRUQsTUFBYSxhQUFvQixTQUFRLHVCQUFnQjtDQUN4RDtBQURELHNDQUNDIn0=