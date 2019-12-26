import { getAllUrlQuery } from '@utils/func.js';

window.$query = getAllUrlQuery();
console.log('$query', window.$query);
if (window.$query.debug == 'true') {
    let s = document.createElement('script');
    s.async = true;
    s.src = '//res.cdn.24haowan.com/dingzhi/public/js/vconsole.min.js';
    let loadEnd = ()=> {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', loadEnd, false);
        let vConsole = new window.VConsole();
    };
    s.addEventListener('load', loadEnd, false);
    document.body.appendChild(s);
}

window.baidu = (type, action = '-', label = '-')=> {
    if (process.env.NODE_ENV !== 'production') {
        // console.warn('dev模式不上报百度统计：', type, action, label)
    } else {
        _hmt ? _hmt.push(['_trackEvent', type, action, label]) : (console.warn('_hmt does not exist'));
    }
};