import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, entersState, StreamType, VoiceConnection, VoiceConnectionDisconnectReason, VoiceConnectionStatus } from "@discordjs/voice";
import { YouTubeSearchResults } from "youtube-search";
import ytdl from "ytdl-core";
import { promisify } from "util";
const wait = promisify(setTimeout);

class musicService {
    public readonly player: AudioPlayer;
    public readonly voiceConnection: VoiceConnection;
    public queue: songData[];
    public queuelock = false;
    public readyLock = false;

    constructor(voiceConnection: VoiceConnection) {
        this.voiceConnection = voiceConnection;
        this.player = createAudioPlayer();
        this.queue = [];


        this.voiceConnection.on("stateChange", async (_, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                // kicked or moved vc
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    try {
                        await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
                        // Probably moved voice channel
                    } catch {
                        this.voiceConnection.destroy();
                        // Probably removed from voice channel
                    }
                } else if (this.voiceConnection.rejoinAttempts < 5) {
                    await wait((this.voiceConnection.rejoinAttempts + 1) * 5_000);
                    this.voiceConnection.rejoin();
                } else if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) {
                    this.voiceConnection.destroy();
                }
            } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                this.stop();
            } else if (
                !this.readyLock &&
                (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
            ) {
                this.readyLock = true;
                try {
                    await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 20_000);
                } catch {
                    if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy();
                } finally {
                    this.readyLock = false;
                }
            }
        });

        this.player.on("stateChange", (oldState, newState) => {
            // song finished playing.
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                (oldState.resource as AudioResource<Song>).metadata.onFinish();
                void this.queueService();
            } else if (newState.status === AudioPlayerStatus.Playing) {
                // song started.
                (newState.resource as AudioResource<Song>).metadata.onStart();
            }
        });

        this.player.on("error", (error) => (error.resource as AudioResource<Song>).metadata.onError(error));

        voiceConnection.subscribe(this.player);
    }

    public stop(): void {
        this.queue = [];
        this.player.stop(true);
        if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy();
    }

    public addToQueue(song: songData): void {
        this.queue.push(song);
        void this.queueService();
    }

    private async queueService(): Promise<void> {
        if (this.queuelock || this.player.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0) {
            return;
        }

        this.queuelock = true;

        const nextSong = this.queue.shift() as Song;
        try {
            const resource = await nextSong.getStream();
            this.player.play(resource);
            this.queuelock = false;
        } catch (e) {
            console.log(e);
        }
    }
}

export default musicService;

export class Song implements songData {
    public readonly songInfo: YouTubeSearchResults;
    public readonly onStart: () => void;
    public readonly onFinish: () => void;
    public readonly onError: (error: Error) => void;

    constructor({ songInfo, onStart, onFinish, onError }: songData) {
        this.songInfo = songInfo;
        this.onStart = onStart;
        this.onFinish = onFinish;
        this.onError = onError;
    }

    public async getStream(): Promise<AudioResource<Song>> {
        const stream = ytdl(this.songInfo.id, { filter: "audioonly", quality: "highestaudio" });
        const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary, metadata: this });

        return resource;
    }

}

export interface songData {
    songInfo: YouTubeSearchResults;
    onStart: () => void;
    onFinish: () => void;
    onError: (error: Error) => void;
}