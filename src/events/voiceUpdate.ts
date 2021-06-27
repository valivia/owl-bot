import { Client, VoiceState } from "discord.js";

export const name = "voiceStateUpdate";

export default function voiceUpdate(_client: Client) {

    return async (_oldState: VoiceState, _newState: VoiceState) => {
        try {
            return;
        } catch (e) {
            console.log(e);

            return;
        }
    };
}