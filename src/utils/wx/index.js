import Vue from 'vue';
import wx from 'weixin-js-sdk';
import {
    get
} from '../api/axios';
import {
    isWeixinBrowser
} from '../func';
import {
    signUrl,
    jsApiList,
    defaultShareInfo
} from './config';

const isPro = process.env.NODE_ENV === 'production';

class WxSdk {

    constructor() {
        Object.assign(this.__proto__, wx);
    }
    
    getWxConfig() {
        if (!isPro || !isWeixinBrowser()) {
            console.warn('非微信浏览器，且非production，不能调用该接口: getWxConfig');
            return Promise.resolve('微信签名配置失败');
        }
        return get(signUrl, {
            url: window.location.href.split('#')[0]
        }).then(result=> {
            if (!result.appId || !result.timestamp || !result.nonceStr || !result.signature) {
                console.warn('微信签名参数错误');
                return Promise.resolve('微信签名配置失败');
            }
            wx.config({
                debug: false,
                ...result,
                jsApiList
            });
            wx.error(err=> {
                console.warn('微信配置失败', err);
            });
            // 这里配置默认的分享
            this.share();
            return Promise.resolve('微信签名配置完成');
        }).catch(err=> {
            console.error('微信签名配置失败', JSON.stringify(err));
            return Promise.reject(err);
        });
    }

    share(info = {}, cb = ()=> {}) {
        if (!isPro || !isWeixinBrowser()) {
            console.warn('非微信浏览器，且非production，不能调用该接口: share');
            return;
        }
        const _info = {
            ...defaultShareInfo,
            ...info
        };
        console.log(_info);
        wx.ready(()=> {
            // 分享好友
            wx.onMenuShareAppMessage({
                title: _info.title,
                desc: _info.desc,
                link: _info.link,
                imgUrl: _info.imgUrl,
                type: _info.type,
                dataUrl: _info.dataUrl,
                success: cb,
                cancel: cb
            });
            // 分享朋友圈
            wx.onMenuShareTimeline({
                title: _info.title,
                link: _info.link,
                imgUrl: _info.imgUrl,
                success: cb,
                cancel: cb
            });
        });
    }
}

Vue.$wxsdk = Vue.prototype.$wxsdk = new WxSdk();