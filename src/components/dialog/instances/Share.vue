<template>
    <BaseDialog
        v-bind="$attrs"
        v-on="$listeners"
        toastTransition="fade"
        :maskClose="true"
        class="dialog-share">
        <div class="share-content">

        </div>
    </BaseDialog>
</template>

<script>
import BaseDialog from "../BaseDialog.vue";
export default {
    name: 'share',
    meta: {
        cn: '分享引导蒙层'
    },
    components: {
        BaseDialog
    },
};
</script>

<style lang="less">
.dialog-share {
    .share-content {
        
    }
}
</style>