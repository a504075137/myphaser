const preDealList = {
    '/server/time': (res)=> {
        return res;
    }
};

export default function preDeal(key, params) {
    if (preDealList[key]) {
        return preDealList[key](params);
    }
    return params;
}