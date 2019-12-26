const signUrl = 'https://custom.24haowan.com/public/wechat/sdk-config';

const jsApiList = [
    // 分享朋友
    'onMenuShareAppMessage',
    // 分享朋友圈
    'onMenuShareTimeline',
    // 录音相关
    // 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice',
    // 'hideMenuItems',
];

let link = require('@imgs/share_icon.png');
if (link.indexOf('//') === 0) {
    link = location.protocol + link;
}

const defaultShareInfo = {
    title: '默认分享标题',
    desc: '默认分享描述',
    link: window.location.href.split('#')[0].split('?')[0],
    imgUrl: link,
    type: 'link',
    dataUrl: ''
};

export {
    signUrl,
    jsApiList,
    defaultShareInfo
};