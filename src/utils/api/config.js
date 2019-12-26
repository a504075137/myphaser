
import {
    jwt
} from '../jwt';

let pro = '//custom.k8s.acgxpro.com';
let dev = 'http://192.168.0.110:3000';

// pro = dev;
dev = pro;
const host = process.env.NODE_ENV === 'production' ? pro : dev;

const defaultHeaders = {
    'Content-Type': 'application/json'
};

const authHeader = {
    Authorization: `Bear ${jwt}`
};

// 超时时间
const timeout = 5000;

// 加密秘钥
const encryptSecret = '';

export default {
    host,
    defaultHeaders,
    authHeader,
    timeout,
    encryptSecret
};