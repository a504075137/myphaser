import Qs from 'qs';
import dayjs from 'dayjs';
import sha1 from 'sha1';
import config from './config';

let serverTime = 0;
let diffTime = 0;
let hadSetServerTime = false;

const sortParams = (params)=> {
    let arr = Qs.stringify(params).split('&');
    arr.sort((a, b) => {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    });
    return arr.join('&');
};

const setServerTime = (st)=> {
    hadSetServerTime = true;
    serverTime = st;
    diffTime = dayjs().format("X") - serverTime;
};

const encrypt = (params)=> {
    if (!hadSetServerTime) {
        console.warn('调用了加密的接口，但没有提前设置服务器时间');
        return {};
    }
    const sortedParams = sortParams(params);
    const time = parseInt(dayjs().format("X")) + parseInt(diffTime);
    const calSig = sha1(`${sortedParams}${time}${config.encryptSecret}`);
    return {
        'X-TIME': time,
        'X-SIG': calSig
    };
};

export {
    setServerTime,
    encrypt
};