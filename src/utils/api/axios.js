import config from './config';
import Axios from 'axios';
import {
    setServerTime,
    encrypt
} from './encrypt';
import preDeal from './preDeal';

const axios = Axios.create({
    baseURL: config.host,
    headers: config.defaultHeaders,
    timeout: config.timeout
});

axios.interceptors.request.use(res=> {
    return res;
}, error=> {
    return Promise.reject(error);
});

axios.interceptors.response.use(response=> {
    let result = '';
    try {
        const {
            data: {
                payload,
                code,
                msg
            }
        } = response;
        if (code != '0') {
            payload.msg = msg;
            payload.code = code;
        }
        result = payload;
    } catch(e) {
        result = response.data;
    }
    const key = response.config.url.replace(config.host, '').split('?')[0];
    return Promise.resolve(preDeal(key, result));
}, error=> {
    console.log(error);
    return Promise.reject(error.response && error.response.data);
});

/**
 * 普通get请求
 * @param {*} url 
 * @param {*} params 
 * @param {*} headers 
 */
const get = (url = '', params = {}, headers = {})=> {
    return axios.get(url, {
        params,
        headers
    });
};

/**
 * 普通post请求
 * @param {*} url 
 * @param {*} params 
 * @param {*} headers 
 */
const post = (url = '', params = {}, headers = {})=> {
    return axios.post(url, params, {
        headers
    });
};

/**
 * 加密的get请求
 * @param {*} url 
 * @param {*} params 
 * @param {*} headers 
 */
const encryptGet = (url = '', params = {}, headers = {})=> {
    return get(url, params, {
        ...headers,
        ...encrypt(params)
    });
};

/**
 * 加密的post请求
 * @param {*} url 
 * @param {*} params 
 * @param {*} headers 
 */
const encryptPost = (url = '', params = {}, headers = {})=> {
    return post(url, params, {
        ...headers,
        ...encrypt(params)
    });
};

/**
 * 带有jwt权限的请求
 */
const auth = {
    get: (url = '', params = {}, headers = {})=> {
        return get(url, params, {
            ...headers,
            ...config.authHeader
        });
    },
    post: (url = '', params = {}, headers = {})=> {
        return post(url, params, {
            ...headers,
            ...config.authHeader
        });
    },
    encryptGet: (url = '', params = {}, headers = {})=> {
        return encryptGet(url, params, {
            ...headers,
            ...config.authHeader
        });
    },
    encryptPost: (url = '', params = {}, headers = {})=> {
        return encryptPost(url, params, {
            ...headers,
            ...config.authHeader
        });
    }
};

export {
    setServerTime, // 如果调用加密的请求方法，需要提前设置服务器时间
    post,
    get,
    encryptGet,
    encryptPost,
    auth
};