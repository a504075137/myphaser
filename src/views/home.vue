<template>
    <div class="home">
        <!-- <div class="start"
             @click="start">开始游戏</div> -->
    </div>
</template>

<script>
export default {
    name: "home",
    meta: {
        cn: "首页"
    },
    mounted() {
        this.$bus.hwpip.listen("judge", e => {
            console.log("end", e);
            if (e === 1) {
                this.$dialog.show("right");
            } else if (e === 2) {
                this.$dialog.show("wrong");
            }
        });
    },
    methods: {
        start() {
            this.$bus.hwpip.add();
        }
    }
};
</script>
<style lang="less">
.home {
    .page();
    .flex-column();
    > .start {
        .wh(3rem, 1rem);
        .center();
        font-size: 0.3rem;
    }
}
</style>
