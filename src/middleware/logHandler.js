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
exports.fetchChannel = void 0;
const colors_1 = __importDefault(require("colors"));
const discord_js_1 = require("discord.js");
const settings_json_1 = require("../../settings.json");
colors_1.default.enable();
let channel;
function logHandler(title, context, author, type, mod = undefined) {
    return __awaiter(this, void 0, void 0, function* () {
        // 0 = green
        // 1 = red
        // other = purple
        const embed = new discord_js_1.MessageEmbed()
            .addField(title, context)
            .setColor(type === 0 ? "#559b0f" : (type === 1 ? "#F50303" : "#b700ff"))
            .setFooter(`${author.username} <@${author.id}>`, author.displayAvatarURL())
            .setTimestamp();
        // add mod if provided.
        if (mod) {
            embed.setAuthor(mod.username, mod.displayAvatarURL());
        }
        // send.
        channel.send(embed);
        return;
    });
}
exports.default = logHandler;
function fetchChannel(client) {
    return __awaiter(this, void 0, void 0, function* () {
        // fetch guild.
        const guild = client.guilds.cache.get(settings_json_1.Options.guild);
        channel = guild.channels.cache.get(settings_json_1.Options.channel);
        if (channel === undefined) {
            console.log("Could not fetch log channel.".bgRed);
            process.exit(1);
        }
    });
}
exports.fetchChannel = fetchChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nSGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZ0hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLDJDQUF3RTtBQUN4RSx1REFBNkM7QUFDN0MsZ0JBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVoQixJQUFJLE9BQWdCLENBQUM7QUFFckIsU0FBOEIsVUFBVSxDQUFDLEtBQWEsRUFBRSxPQUFlLEVBQUUsTUFBWSxFQUFFLElBQVksRUFBRSxNQUF3QixTQUFTOztRQUNsSSxZQUFZO1FBQ1osVUFBVTtRQUNWLGlCQUFpQjtRQUNqQixNQUFNLEtBQUssR0FBRyxJQUFJLHlCQUFZLEVBQUU7YUFDL0IsUUFBUSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUM7YUFDeEIsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBRSxDQUFDO2FBQ3hFLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLE1BQU0sTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2FBQzFFLFlBQVksRUFBRSxDQUFDO1FBRWhCLHVCQUF1QjtRQUN2QixJQUFJLEdBQUcsRUFBRTtZQUNMLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFBO1NBQ3hEO1FBRUQsUUFBUTtRQUNSLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbkIsT0FBTztJQUNYLENBQUM7Q0FBQTtBQWxCRCw2QkFrQkM7QUFFRCxTQUFzQixZQUFZLENBQUMsTUFBYzs7UUFDN0MsZUFBZTtRQUNmLE1BQU0sS0FBSyxHQUFVLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyx1QkFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVELE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsdUJBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwRCxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNqRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ2xCO0lBQ0wsQ0FBQztDQUFBO0FBUkQsb0NBUUMifQ==