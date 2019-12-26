import Vue from 'vue';
import {
    isWeixinBrowser,
    isAndroid,
    isIos,
    isWide
} from './func';
import {
    userInfo
} from './jwt';
import HwPip from '@game/HwPip';
const bus = new Vue({
    data() {
        return {
            ready: false,
            showMusicIcon: false,
            isWeixinBrowser: isWeixinBrowser(),
            isAndroid: isAndroid(),
            isIos: isIos(),
            isWide: isWide(),
            userInfo: {
                nickname: '',
                headimgurl: '',
                openid: '',
                unionid: '',
                wxappid: ''
            }
        };
    },
    created() {
        this.hwpip = new HwPip();
        Object.assign(this.userInfo, userInfo);
        const hiddenProperty = 'hidden' in document ? 'hidden' :
            'webkitHidden' in document ? 'webkitHidden' :
                'mozHidden' in document ? 'mozHidden' : null;
        if (hiddenProperty) {
            const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
            const onVisibilityChange = (e) => {
                if (document[hiddenProperty]) {
                    console.log('hidden');
                    this.$audio.visibilityChangeMute(true);
                } else {
                    console.log('resume');
                    this.$audio.visibilityChangeMute(false);
                    this.$bus.$emit('resume');
                }
            };
            document.addEventListener(visibilityChangeEvent, onVisibilityChange);
        }
    },
    computed: {

    },
    methods: {

    }
});

Vue.$bus = Vue.prototype.$bus = bus;