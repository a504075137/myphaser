<template>
    <transition name="fade">
        <div class="toast-box" v-show="visible">
            <div class="toast-wrap">
                {{options.message}}
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'toast',
    data() {
        return {
            visible: false,
            options: {
                message: ''
            }
        };
    },
};
</script>

<style lang="less">
.toast-box {
    .page(transparent);
    .flex();
    pointer-events: none;
    > .toast-wrap {
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        box-sizing: border-box;
        text-align: center;
        z-index: 999999;
        padding: 0.15rem 0.25rem;
        font-size: 0.3rem;
        font-weight: bold;
        line-height: 1;
        border-radius: 0.5rem;
        max-width: 90%;
        word-break: break-all;
        // width: fit-content;
        // .center();
    }
}
</style>
