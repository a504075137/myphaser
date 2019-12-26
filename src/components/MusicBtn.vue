<template>
    <div class="music-btn" v-show="show">
        <img
            :src="musicIcon"
            :class="muted ? '' : mutedClass"
            @click="switchMusic" />
    </div>
</template>

<script>

export default {
    name: 'MusicBtn',
    props: {
        icon: {
            default: require('@imgs/icon_music.png')
        },
        closeIcon: {
            default: ''
        }
    },
    data() {
        return {
            mutedClass: 'play',
            muted: false
        };
    },
    created () {
        this.muted = this.$audio.muted;
        this.mutedClass = this.closeIcon ?  '' : 'play';
    },
    computed: {
        musicIcon() {
            if (!this.closeIcon || !this.muted) {
                return this.icon;
            }
            return this.closeIcon;
        },
        show() {
            return this.$bus.showMusicIcon;
        }
    },
    methods: {
        switchMusic() {
            this.muted = !this.muted;
            this.$audio.gStorgeMute(this.muted);
        }
    }
};
</script>
<style lang="less">
.music-btn {
    .p-a();
    right: 0.25rem;
    top: 0.1rem;
    z-index: 99999;
    > img {
        width: 0.85rem;
        height: auto;
    }
    > .play {
        // .rotate();
    }
}
</style>
