import Vue from 'vue';
import '@utils/storage';
import '@utils/howler.min.js';
import {
    wxinvoke
} from './func';
const Howl = window.Howl;
const Howler = window.Howler;

class AudioManager {
    constructor() {
        this.audioList = new Map();
        this.playingList = new Set();
        this.srcList = [];
        this.muted = false;
        this.visibilityHiddenMuted=false;
        this.initMuted();
    }

    _autoPlay(audio) {
        wxinvoke(()=> {
            audio.play();
        });
    }

    load(key, srcData) {
        return new Promise((resolve, reject)=> {
            key = key.replace(/(\.\/)/, '').replace(/(\/)|(\.)/g, '_');
            // key = key.replace(/(\.\/)/, '').split('.')[0];
            this.srcList = [];
            let [item] = this.srcList.filter(item=> item.src == srcData);
            if (item) {
                this.audioList.set(key, item.audio);
                resolve(1);
                return;
            }
            const audio = new Howl({
                src: srcData,
                preload: true,
                onloaderror: (id) => {
                    console.warn('loaderror: ', key);
                    resolve();
                },
            });

            audio.once('load', () => {
                this.audioList.set(key, audio);
                this.srcList.push({
                    src: srcData,
                    audio
                });
                resolve();
            });
        });
    }

    remove(key) {
        if (this.audioList.has(key)) {
            this.audioList.delete(key);
        }
    }

    play(key, {
        loop = false, // 循环播放
        autoplay = false, // 自动播放
        repeat = false,
        play = ()=> {},
        end = ()=> {},
        pause = ()=> {}
    } = {}) {
        if (this.playingList.has(key)) {
            const audio = this.audioList.get(key);
            if (!audio.playing()) {
                const _over = ()=> {
                    this.playingList.delete(key);
                    end();
                };
                loop || audio.once('end', _over);
                audio.once('stop', _over);
                audio.once('play', play);
                audio.once('pause', pause);
                audio.play();
                return;
            } else if (!repeat) {
                return;
            }
        }
        if (this.audioList.has(key)) {
            console.log('play music', key);
            this.playingList.add(key);
            const _over = ()=> {
                this.playingList.delete(key);
                end();
            };
            const audio = this.audioList.get(key).loop(loop);
            loop || audio.once('end', _over);
            audio.once('stop', _over);
            audio.once('play', play);
            audio.once('pause', pause);
            autoplay ? this._autoPlay(audio) : audio.play();
        } else {
            console.warn('unload', key);
        }
    }

    stop(key) {
        const _stop = (key)=> this.playingList.delete(key);
        if (this.playingList.has(key)) {
            const audio = this.audioList.get(key);
            audio.once('stop', _stop(key));
            audio.stop();
        }
    }

    pause(key) {
        if (this.playingList.has(key)) {
            const audio = this.audioList.get(key);
            audio.pause();
        }
    }

    pauseAll() {
        for (let key of this.playingList) {
            this.pause(key);
        }
    }

    stopAll() {
        for (let key of this.playingList) {
            this.stop(key);
        }
    }

    getDuration(key) {
        if (this.audioList.has(key)) {
            const audio = this.audioList.get(key);
            return audio.duration();
        }
        return 0;
    }

    setSeek(key, pre) {
        if (this.audioList.has(key)) {
            const audio = this.audioList.get(key);
            audio.seek(audio.duration() * pre / 100);
        }
    }

    getSeek(key) {
        if (this.audioList.has(key)) {
            const audio = this.audioList.get(key);
            return audio.seek();
        }
        return 0;
    }

    volume(key, vol) {
        if (this.audioList.has(key)) {
            const audio = this.audioList.get(key);
            audio.volume(vol);
        }
    }

    isPlaying(key) {
        if (this.audioList.has(key)) {
            const audio = this.audioList.get(key);
            return audio.playing();
        }
        return false;
    }

    hasMusic(key) {
        return this.audioList.has(key);
    }

    mute(key, muted = true) {
        if (this.playingList.has(key)) {
            const audio = this.audioList.get(key);
            audio.mute(muted);
        }
    }

    gMute(muted = true) {
        this.muted = muted;
        Howler.mute(muted);
    }

    initMuted() {
        //初始化一下本地储存的静音状态
        if (Vue.$storage.load('muted')) {
            this.gStorgeMute(true);
        } else {
            this.gStorgeMute(false);
        }
    }

    gStorgeMute(muted = true) {
        //写入本地储存的全局静音
        this.muted = muted;
        Howler.mute(muted);
        Vue.$storage.save('muted', muted);
    }

    visibilityChangeMute(muted=true){
        //页面隐藏时可以调用这个方法静音，如果已经设置了全局静音，就算恢复页面时也不会变成变成不静音的情况；
        console.log('visibilityChangeMute:',muted,'audioMuted:',this.muted);
        this.visibilityHiddenMuted = muted;
        if(this.muted){
            return;
        }
        Howler.mute(muted);
    }
}

Vue.$audio = Vue.prototype.$audio = new AudioManager();