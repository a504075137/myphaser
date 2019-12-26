<template>
    <div class="page-loading">
        <div class='progress-box'>
            <div class="progress-text">{{numProgress}}</div>
            <div class="progress-bg">
                <div class="progress"
                     :style='{width: `${loadProgress}%`}'></div>
            </div>
        </div>
    </div>
</template>

<script>
import { requireAll } from "@utils/func";
import pipImgList from "@game/pipAssetsList";
export default {
    name: "loading",
    meta: {
        cn: "加载页"
    },
    data() {
        return {
            loadProgress: 0
        };
    },
    computed: {
        numProgress() {
            return `${Math.floor(this.loadProgress)}%`;
        }
    },
    async mounted() {
        this.$bus.hwpip
            .create({
                width: window.innerWidth * 2,
                height: window.innerHeight * 2,
                parent: "hwpip"
            })
            .init(pipImgList);
        this.init();
    },
    methods: {
        async init() {
            this.total = {
                img: 0,
                audio: 0,
                api: 0,
                all: 0
            };
            this.loadNum = {
                img: 0,
                audio: 0,
                api: 0,
                all: 0
            };
            let assets = {
                imgList: [],
                gameImgList: [],
                audioList: []
            };
            assets.imgList = requireAll(require.context("@imgs", true));
            assets.audioList = requireAll(require.context("@audios", true));
            assets.gameImgList = pipImgList;
            this.preload(assets);
        },
        getGameImgLength(list) {
            let len = 0;
            for (let i = 0; i < list.length; ++i) {
                if (list[i].type === "container") {
                    len += this.getGameImgLength(list[i].children);
                } else {
                    len++;
                }
            }
            return len;
        },
        async preload(assets) {
            this.total.img = assets.imgList.length;
            this.total.audio = assets.audioList.length;

            if (assets.gameImgList.length > 0) {
                // 这部分是游戏里面自己加载的，比如phaser引擎
                this.total.img += this.getGameImgLength(assets.gameImgList);
            }

            this.total.all = this.total.img + this.total.audio;

            Promise.all([
                this.loadImg(assets.imgList, assets.gameImgList),
                this.loadAudio(assets.audioList, true, {
                    bgm_mp3: {
                        loop: true,
                        autoplay: true
                    }
                }),
                ...this.getApi()
            ])
                .then(resList => {
                    console.log(resList);
                    this.loadFinish();
                })
                .catch(err => {
                    console.error(err);
                });
        },
        getApi() {
            const list = [this.$wxsdk.getWxConfig()];
            return list;
        },
        loaded(type) {
            this.loadNum[type]++;
            this.loadNum.all++;
            this.loadProgress = (this.loadNum.all * 100) / this.total.all;
            if (this.loadNum[type] >= this.total[type]) {
                return true;
            }
            return false;
        },
        loadImg(list = [], game_list = []) {
            return new Promise((resolve, reject) => {
                for (let item of list) {
                    let img = new Image();
                    img.onload = img.onerror = () => {
                        if (this.loaded("img")) {
                            resolve("图片加载完成");
                        }
                    };
                    img.src = item.data;
                }
                if (!game_list) {
                    game_list = [];
                }
                // 下面加载游戏部分图片
                if (game_list.length > 0) {
                    this.$bus.hwpip.load(() => {
                        if (this.loaded("img")) {
                            resolve("图片加载完成");
                        }
                    });
                }
            });
        },
        /**
         * 第二个参数表示是否异步加载，一般为true，
         * 除非音乐很重要，需要加载完才能进入H5.
         */
        loadAudio(list = [], asyncLoad = false, config = {}) {
            return new Promise((resolve, reject) => {
                for (let item of list) {
                    if (asyncLoad) {
                        this.loaded("audio") && resolve("音频加载完成");
                    }
                    this.$audio.load(item.path, item.data).then(() => {
                        this.playAudio(item.path, config);
                        if (!asyncLoad) {
                            this.loaded("audio") && resolve("音频加载完成");
                        }
                    });
                }
            });
        },
        loadFinish() {
            this.$bus.ready = true;
            this.$bus.showMusicIcon = true;
            this.$router.replace("home");
        },
        playAudio(path, config) {
            path = path.replace(/(\.\/)/, "").replace(/(\/)|(\.)/g, "_");
            // path = path.replace(/(\.\/)/, '').split('.')[0];
            if (config[path]) {
                this.$audio.play(path, config[path]);
            }
        }
    }
};
</script>

<style lang="less">
.page-loading {
    .page(aqua);
    > .progress-box {
        width: 60%;
        .center();
        .flex-column();
        > .progress-text {
            font-size: 0.3rem;
            margin-bottom: 10px;
        }
        > .progress-bg {
            .wh(100%, 10px);
            background-color: white;
            border-radius: 10px;
            > .progress {
                width: 0%;
                height: 10px;
                background-color: aquamarine;
                transition: width 0.3s;
                border-radius: 10px;
            }
        }
    }
}
</style>
