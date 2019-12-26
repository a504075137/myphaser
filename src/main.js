import '@utils/window';
import '@c/toast';
import '@utils/storage';
import '@utils/bus';
import '@utils/filters';
import '@utils/api';
import '@utils/wx';
import '@utils/audio';
import '@directive';
import '@game/HwPip';
import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
