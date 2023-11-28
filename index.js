"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Уявіть, що ви створюєте додаток мультимедійного плеєра, який може відтворювати різні типи медіа, такі як аудіо та відео. 
// Ваше завдання - реалізувати фасад для мультимедійного плеєра, щоб спростити взаємодію з ним для кінцевого користувача.
const types_1 = require("./types");
class AudioFile {
    title;
    artist;
    duration;
    type = "Audio" /* EMediaType.Audio */;
    constructor(title, artist, duration = 1000) {
        this.title = title;
        this.artist = artist;
        this.duration = duration;
    }
}
class VideoFile {
    title;
    releaseDates;
    duration;
    type = "Video" /* EMediaType.Video */;
    constructor(title, releaseDates, duration = 2000) {
        this.title = title;
        this.releaseDates = releaseDates;
        this.duration = duration;
    }
}
class Engine {
    playing;
    _playbackProcess = "Play" /* EPlaybackProcess.Play */;
    play() {
        if (this._playbackProcess !== "Play" /* EPlaybackProcess.Play */) {
            this._playbackProcess = "Play" /* EPlaybackProcess.Play */;
        }
    }
    pause() {
        if (this._playbackProcess !== "Pause" /* EPlaybackProcess.Pause */) {
            this._playbackProcess = "Pause" /* EPlaybackProcess.Pause */;
        }
    }
    stop() {
        if (this._playbackProcess !== "Stop" /* EPlaybackProcess.Stop */) {
            this._playbackProcess = "Stop" /* EPlaybackProcess.Stop */;
        }
    }
    get playbackProcess() {
        return this._playbackProcess;
    }
}
class AudioEngine extends Engine {
    playback(file) {
        this.playing = file;
        return new Promise((resolve, reject) => {
            let counter = 0;
            let statePause = false;
            const interval = setInterval(() => {
                switch (this.playbackProcess) {
                    case "Pause" /* EPlaybackProcess.Pause */:
                        if (!statePause) {
                            statePause = !statePause;
                            console.log(`pause song - '${this.playing.title} - ${this.playing.artist}'`);
                        }
                        break;
                    case "Stop" /* EPlaybackProcess.Stop */:
                        console.log(`stop song - '${this.playing.title} - ${this.playing.artist}'`);
                        resolve(this.playbackProcess);
                        clearInterval(interval);
                        break;
                    default:
                        if (counter === 0) {
                            console.log(`play song - '${this.playing.title} - ${this.playing.artist}'`);
                        }
                        else {
                            if (counter === (file.duration - 100)) {
                                console.log(`finish song - '${this.playing.title} - ${this.playing.artist}'`);
                                resolve(this.playbackProcess);
                                clearInterval(interval);
                            }
                            else {
                                console.log('la-la-la');
                            }
                        }
                        counter += 100;
                        break;
                }
            }, 100);
        });
    }
    rewind() { }
    fastForward() { }
}
class VideoEngine extends Engine {
    playback(file) {
        this.playing = file;
        return new Promise((resolve, reject) => {
            let counter = 0;
            let statePause = false;
            const interval = setInterval(() => {
                switch (this.playbackProcess) {
                    case "Pause" /* EPlaybackProcess.Pause */:
                        if (!statePause) {
                            statePause = !statePause;
                            console.log(`pause movie - '${this.playing.title}'`);
                        }
                        break;
                    case "Stop" /* EPlaybackProcess.Stop */:
                        console.log(`stop movie - '${this.playing.title}'`);
                        resolve(this.playbackProcess);
                        clearInterval(interval);
                        break;
                    default:
                        if (counter === 0) {
                            console.log(`start movie - '${this.playing.title}'`);
                        }
                        else {
                            if (counter === (file.duration - 100)) {
                                console.log(`the end movie - '${this.playing.title}'`);
                                resolve(this.playbackProcess);
                                clearInterval(interval);
                            }
                            else {
                                console.log('blam-blam-blam');
                            }
                        }
                        counter += 100;
                        break;
                }
            }, 100);
        });
    }
    rewind() { }
    fastForward() { }
}
class VolumeControl {
    _currentVolume = 66;
    get currentVolume() {
        return this._currentVolume;
    }
    quiet() {
        if (this._currentVolume === 100) {
            return;
        }
        else {
            console.log(`Volume - ${this._currentVolume}`);
            this._currentVolume += 10;
        }
    }
    louder() {
        if (this._currentVolume === 0) {
            return;
        }
        else {
            console.log(`Volume - ${this._currentVolume}`);
            this._currentVolume -= 10;
        }
    }
}
class PlaylistManager {
    _originalList = [];
    _list = [...this._originalList];
    get list() {
        return this._list;
    }
    addMediaFile(file) {
        this._list.push(file);
        this._originalList.push(file);
    }
    removeMediaFile(file) {
        const indexList = this._list.indexOf(file);
        if (indexList >= 0) {
            this._list.splice(indexList, 1);
        }
        const indexOriginalList = this._originalList.indexOf(file);
        if (indexOriginalList >= 0) {
            this._originalList.splice(indexOriginalList, 1);
        }
    }
    clearList() {
        this._list.length = 0;
        this._originalList.length = 0;
    }
    editList(list) {
        this._list.length = 0;
        this._list.push(...list);
    }
    sequentialPlay() {
    }
    randomPlay() {
    }
}
class MultimediaPlayer {
    _audioEngine = new AudioEngine();
    _videoEngine = new VideoEngine();
    _volumeControl = new VolumeControl();
    _playlistManager = new PlaylistManager();
    _repeat = false;
    _playing;
    _playbackProcess;
    _playbackOrder = "Sequentially play" /* EPlaybackOrder.Sequentially */;
    get repeat() {
        return this._repeat;
    }
    get playing() {
        return this._playing;
    }
    get currentVolume() {
        return this._volumeControl.currentVolume;
    }
    get playbackOrder() {
        return this._playbackOrder;
    }
    get playlist() {
        return this._playlistManager.list;
    }
    addToPlaylist(file) {
        this._playlistManager.addMediaFile(file);
    }
    removeFromPlaylist(file) {
        this._playlistManager.removeMediaFile(file);
    }
    clearPlaylist() {
        this._playlistManager.clearList();
    }
    async playback() {
        if (this.playlist.length > 0) {
            this._playbackProcess = "Play" /* EPlaybackProcess.Play */;
            for (let item of this.playlist) {
                if ((0, types_1.isAudioFile)(item)) {
                    if (this._playbackProcess === "Play" /* EPlaybackProcess.Play */) {
                        this._playing = item;
                        await this._audioEngine.playback(item);
                    }
                    else {
                        if (this._playbackProcess === "Stop" /* EPlaybackProcess.Stop */) {
                            return;
                        }
                    }
                }
                else {
                    if (this._playbackProcess === "Play" /* EPlaybackProcess.Play */) {
                        this._playing = item;
                        await this._videoEngine.playback(item);
                    }
                    else {
                        if (this._playbackProcess === "Stop" /* EPlaybackProcess.Stop */) {
                            return;
                        }
                    }
                }
            }
        }
    }
    play() {
        switch (this._playbackProcess) {
            case "Pause" /* EPlaybackProcess.Pause */:
                this._playbackProcess = "Play" /* EPlaybackProcess.Play */;
                if ((0, types_1.isAudioFile)(this._playing)) {
                    this._audioEngine.play();
                }
                else {
                    this._videoEngine.play();
                }
                break;
            case "Stop" /* EPlaybackProcess.Stop */:
                const index = this.playlist.indexOf(this._playing);
                const newPlaylist = this.playlist.slice(index);
                this._playlistManager.editList(newPlaylist);
                this._audioEngine.play();
                this._videoEngine.play();
                this.playback();
                break;
        }
    }
    pause() {
        if (this._playbackProcess === "Pause" /* EPlaybackProcess.Pause */
            || this._playbackProcess === "Stop" /* EPlaybackProcess.Stop */) {
            return;
        }
        else {
            this._playbackProcess = "Pause" /* EPlaybackProcess.Pause */;
            if ((0, types_1.isAudioFile)(this._playing)) {
                this._audioEngine.pause();
            }
            else {
                this._videoEngine.pause();
            }
        }
    }
    stop() {
        if (this._playbackProcess !== "Stop" /* EPlaybackProcess.Stop */) {
            this._playbackProcess = "Stop" /* EPlaybackProcess.Stop */;
            if ((0, types_1.isAudioFile)(this._playing)) {
                this._audioEngine.stop();
            }
            else {
                this._videoEngine.stop();
            }
        }
    }
    switchRepeat() {
    }
    rewind() {
    }
    fastForward() {
    }
    previous() {
    }
    next() {
    }
    sequentialPlay() {
    }
    randomPlay() {
    }
    quiet() {
        this._volumeControl.quiet();
    }
    louder() {
        this._volumeControl.louder();
    }
}
// examples
const player = new MultimediaPlayer();
player.addToPlaylist(new AudioFile('title song 1', 'artist 1'));
player.addToPlaylist(new AudioFile('title song 2', 'artist 2'));
player.addToPlaylist(new AudioFile('title song 3', 'artist 3'));
player.addToPlaylist(new VideoFile('title movie 1', new Date('01.01.2000')));
player.addToPlaylist(new VideoFile('title movie 2', new Date('02.01.2000')));
player.playback();
setTimeout(() => {
    player.pause();
}, 1500);
setTimeout(() => {
    player.play();
}, 2000);
setTimeout(() => {
    player.pause();
}, 5000);
setTimeout(() => {
    player.play();
}, 5500);
setTimeout(() => {
    player.pause();
}, 6500);
setTimeout(() => {
    player.play();
}, 7000);
