<template>
    <section :class="'BaseDialog'">
        <transition name="fade" appear>
            <section
                v-show="show"
                class="BaseDialog__mask"
                :class="[showMask || 'opacity', orientation]"
            />
        </transition>
        <transition :name="dialogTransition" appear>
            <section
                v-show="show"
                class="BaseDialog__wrapper_box"
                :class="dialogType"
                :style="{
                    'pointer-events': animationOver ? 'auto' : 'none'
                }">
                <section
                    v-show="show"
                    class="BaseDialog__inner_mask"
                    @click="maskClose && $emit('close')"
                />
                <section class="BaseDialog__wrapper">
                    <div class="closeBtn selfConfigClose"
                        :class="closeClass"
                        v-if="showClose"
                        @click="close"
                        :style="{
                            backgroundImage: `url(${$bus.dialogCloseBtn})`
                        }" />
                    <slot />
                </section>
            </section>
        </transition>
    </section>
</template>

<script>
export default {
    name: "BaseDialog",
    props: {
        dialogTransition: {
            type: String,
            default: "bounceUp"
        },
        showClose: {
            type: Boolean,
            default: false
            // default: true
        },
        closeClass: {
            type: String,
            default: ''
        },
        showMask: {
            type: Boolean,
            default: true
        },
        show: {
            type: Boolean,
            default: false
        },
        animationOver: {
            default: false
        },
        //点击mask关闭弹窗
        maskClose: {
            type: Boolean,
            default: false
            // default: true
        },
        dialogType: {
            type: String,
            default: ""
        },
        orientation: {
            type: String,
            default: "portrait",
            validator(value) {
                return ["landscape", "portrait"].indexOf(value) !== -1;
            }
        },
        closeAction: {
            type: Function,
            default: null
        }
    },
    data() {
        return {};
    },
    methods: {
        close() {
            if (this.closeAction) {
                this.closeAction();
            } else {
                this.$emit('close');
            }
        }
    }
};
</script>

<style lang="less">
.BaseDialog {
    .p-f();
    .wh(100vw, 100vh);
    top: 0;
    left: 0;
    color: white;
    z-index: 999999;
    > .BaseDialog__wrapper_box {
        .p-a();
        .flex();
        .wh(100vw, 100vh);
        > .BaseDialog__inner_mask {
            .p-a();
            .wh(100%);
            top: 0;
            left: 0;
        }
        > .BaseDialog__wrapper {
            .p-r();
            z-index: 10;
            > .closeBtn {
                .p-a();
                z-index: 100;
                transition: opacity 0.5s;
            }
        }
    }
    > .BaseDialog__mask {
        .p-a();
        top: 0;
        left: 0;
        .wh(100%);
        background-color: rgba(0, 0, 0, 0.85);
        &.opacity {
            background-color: transparent;
        }
    }
}
</style>