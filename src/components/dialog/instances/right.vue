<template>
    <BaseDialog v-bind="$attrs"
                v-on="$listeners"
                toastTransition="fade"
                :maskClose="true"
                class="dialog-right">
        <div class="right-content">
            <div class="score">10秒</div>
            <p class='rank'>当前游戏排名为2 第一名是淳爷</p>
        </div>
    </BaseDialog>
</template>

<script>
import BaseDialog from "../BaseDialog.vue";
export default {
    name: "right",
    meta: {
        cn: "对"
    },
    components: {
        BaseDialog
    }
};
</script>

<style lang="less">
.dialog-right {
    .right-content {
        .wh(6.74rem, 7.15rem);
        .bg-contain("game_success.png");
        > .rank {
            .center-row();
            top: 5.09rem;
            font-size: 0.21rem;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #8c471c;
        }
        > .score {
            .bg-contain("score.png");
            .wh(1.95rem, 0.74rem);
            .center-row();
            top: 3.22rem;
            font-size: 0.42rem;
            font-weight: bold;
            font-stretch: normal;
            letter-spacing: 0.04rem;
            line-height: 0.74rem;
            text-align: center;
            color: #ffffff;
        }
    }
}
</style>