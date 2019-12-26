import Vue from 'vue';
import dayjs from 'dayjs';

Vue.filter('time',  (value, formatString = 'YYYY-MM-DD HH:mm:ss')=> {
    return dayjs(value).format(formatString);
});