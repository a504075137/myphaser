import jwtDecode from 'jwt-decode';
import {
    getCookie
} from './func';

const getJwt = ()=> {
    const entrance = getCookie('entrance');
    const jwt = getCookie(`_entry_${entrance}_sid`);
    return jwt;
};

const testJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJyZXNpZCI6IiIsIm9wZW5pZCI6Im9JelM0d2Z2UjM0anNoU2J5eVFSU3FiakZMcXMiLCJ1bmlvbmlkIjoib2p1UVR3Z3Z3UmxMYy04S0J2RTBVT0tHdmU4OCIsInd4YXBwaWQiOiJ3eGVjMmI2YzllNGJjNDdhZjgiLCJzY29wZSI6InByaXZhdGUiLCJleHAiOjE1NDc5ODczNjEwLCJuaWNrbmFtZSI6IuW8uuWtkCIsImhlYWRpbWd1cmwiOiJodHRwOi8vdGhpcmR3eC5xbG9nby5jbi9tbW9wZW4vdmlfMzIvbkFVZXJCU0UwQVQ3c0h1dGdyVnpoeklpYmNqUGdXS3FRRUpVVEpBdkZuVldPQjQxdXB1QjhIdkNCc29lMXFoa01YWW02VVlWeHJpYWxreVdCNVFEd3RwUS8xMzIiLCJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKeVpYTnBaQ0k2SWlJc0ltOXdaVzVwWkNJNkltOUplbE0wZDJaMlVqTTBhbk5vVTJKNWVWRlNVM0ZpYWtaTWNYTWlMQ0oxYm1sdmJtbGtJam9pYjJwMVVWUjNaM1ozVW14TVl5MDRTMEoyUlRCVlQwdEhkbVU0T0NJc0luZDRZWEJ3YVdRaU9pSjNlR1ZqTW1JMll6bGxOR0pqTkRkaFpqZ2lMQ0p6WTI5d1pTSTZJbkJ5YVhaaGRHVWlMQ0psZUhBaU9qRTFORGM1T0Rjek5qRXNJbWxoZENJNk1UVTBOek00TWpVMk1YMC5FQllid0J5bVpUUEtWUlhJdFFtMDFtOWVYSXVPVDBiampMcXJQOEVKYnFzIn0sImVudHJhbmNlIjoiY29tcGFueS0xLWFwcGlkLTEtZ2FtZWlkLTc4IiwiaWF0IjoxNTQ3MzgyNTYxLCJleHAiOjE1NDc0Njg5NjEwfQ.H38u0Db8TEPqVNiYl1ECSTsmt5Jbf8eHbaVej2-3roM';


const jwt = process.env.NODE_ENV === 'production' ? getJwt() : testJwt;
let userInfo = {};

try {
    userInfo = jwtDecode(jwt).userInfo;
} catch(e) {
    console.log('jwt', e);
    userInfo = {};
}

export {
    jwt,
    userInfo
};