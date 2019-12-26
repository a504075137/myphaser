<template>
    <BaseDialog v-bind="$attrs"
                v-on="$listeners"
                toastTransition="fade"
                :maskClose="true"
                class="dialog-wrong">
        <div class="wrong-content">

        </div>
    </BaseDialog>
</template>

<script>
import BaseDialog from "../BaseDialog.vue";
export default {
    name: "wrong",
    meta: {
        cn: "错"
    },
    components: {
        BaseDialog
    }
};
</script>

<style lang="less">
.dialog-wrong {
    .wrong-content {
        .wh(5.43rem, 5.12rem);
        .bg-contain("fish_fail.png");
    }
}
</style>