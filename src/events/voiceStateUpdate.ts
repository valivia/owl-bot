import { VoiceState } from "discord.js";
import { OwlClient } from "../types/classes";

export default function voiceUpdate(_client: OwlClient) {

    return async (_oldState: VoiceState, _newState: VoiceState) => {
        try {
            return;
        } catch (e) {
            console.log(e);

            return;
        }
    };
}