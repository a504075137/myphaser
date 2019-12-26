<template>
    <div 
        class="project-loading"
        v-show="showLoading"
        @click="()=>{}">
        <div class="loading-box">
            <img class="icon rotate" src="@imgs/loading.svg" />
            <p class="text" v-show="text || text === 0">{{text}}</p>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
export default {
    name: 'project-loading',
    data() {
        return {
            showLoading: false,
            text: '加载中...'
        };
    },
    created() {
        Vue.$loading = Vue.prototype.$loading = {
            show: (text = '加载中...')=> {
                this.show(text);
            },
            hide: ()=> {
                this.hide();
            }
        };
    },
    methods: {
        show(text) {
            this.text = text;
            this.showLoading = true;
        },
        hide() {
            this.showLoading = false;
        }
    }
};
</script>

<style lang="less">
.project-loading {
    .page(transparent);
    z-index: 9999999999;
    > .loading-box {
        .center();
        .wh(100px);
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 10px;
        .flex-column();
        color: white;
        > .icon {
            .wh(36px);
            // .rotate(1.5s);
        }
        > .text {
            font-size: .25rem;
            margin-top: 0.3rem;
            width: 80%;
            font-weight: bold;
            text-align: center;
        }
    }
}
</style>
