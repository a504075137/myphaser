import Vue from 'vue';
import {
    setServerTime,
    post,
    get,
    encryptGet,
    encryptPost,
    auth
} from './axios';

class Api {
    async getServerTime() {
        const data = await get('/server/time');
        setServerTime(data.server_time);
    }
}


Vue.$api = Vue.prototype.$api = new Api();