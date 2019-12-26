<template>
    <div id="app">
        <div id="hwpip"
             class="hwpip"></div>

        <transition name="fade">
            <router-view />
        </transition>
        <DialogHandler />
        <MusicBtn />
        <Loading />
    </div>
</template>

<script>
import MusicBtn from "@c/MusicBtn";
import Loading from "@c/loading";
import DialogHandler from "@c/dialog/DialogHandler";

export default {
    name: "app",
    components: {
        MusicBtn,
        DialogHandler,
        Loading
    }
};
</script>

<style lang="less">
#app {
    .page();
    > .hwpip {
        z-index: 9 !important;
        .page();
        > canvas {
            .wh(100%);
        }
    }
}
</style>
