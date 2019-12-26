<template>
    <keep-alive>
        <component
            :is="currentDialog"
            :show="showDialog"
            :animationOver="animationOver"
            :style="{
                'pointer-events': showing ? 'auto' : 'none'
            }"
            v-bind="vBind"
            ref="dialog"
            @close="close"
        />
    </keep-alive>
</template>

<script>
import Vue from "vue";
import components from "./instances/index.js";

export default {
    components,
    data() {
        return {
            currentDialog: "",
            showDialog: false,
            showing: false,
            animationOver: false,
            vBind: {}
        };
    },
    created() {
        Vue.$dialog = Vue.prototype.$dialog = this;
        this.inShowing = false;
        this.saveDialogName = "";
    },
    methods: {
        saveDialog(name = this.currentDialog) {
            !this.saveDialogName && (this.saveDialogName = name);
        },
        clearSave() {
            this.saveDialogName = "";
        },
        show(name, vBind = {}, save = false, duration = 1000) {
            if (this.inShowing || !(name in components)) {
                // console.log('请检查弹窗', name, '是否存在');
                return false;
            }
            this.inShowing = true;
            this.vBind = vBind;
            save && this.saveDialog();
            this.showDialog
                ? this._showNextDialog(name, duration)
                : this._showDialog(name, duration);
            return true;
        },
        close(forceClose = false, duration = 1000) {
            if (this.inShowing) {
                return;
            }
            this.handleShowDialog(false, duration);
            if (this.saveDialogName === this.currentDialog) {
                this.saveDialogName = "";
            } else if (!forceClose && this.saveDialogName) {
                this.$func
                    .wait(duration)
                    .then(
                        this._showDialog.bind(
                            this,
                            this.saveDialogName,
                            duration
                        )
                    );
            }
        },
        _showDialog(name, duration) {
            this.currentDialog = name;
            this.$nextTick(() => {
                this.handleShowDialog(true, duration);
            });
            this.$func.wait(1000).then(() => {
                this.inShowing = false;
            });
        },
        _showNextDialog(name, duration) {
            this.handleShowDialog(false, duration);
            this.$func
                .wait(duration)
                .then(this._showDialog.bind(this, name, duration));
        },
        handleShowDialog(isShow, duration) {
            const dialog = this.$refs.dialog;
            this.showDialog = isShow;
            if (isShow) {
                this.showing = isShow;
                this.$func
                    .wait(duration)
                    .then(() => (this.animationOver = isShow));
            } else {
                this.animationOver = isShow;
                this.$func.wait(duration).then(() => (this.showing = isShow));
            }
            const {
                name,
                meta: { cn = name }
            } = components[this.currentDialog];
            isShow
                ? window.baidu("event", `enter_${name}`, `进入${cn}`)
                : window.baidu("event", `leave_${name}`, `离开${cn}`);
        }
    }
};
</script>