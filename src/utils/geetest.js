let head = document.getElementsByTagName('head')[0];

function _Object(obj) {
    this._obj = obj;
}

_Object.prototype = {
    _each: function(process) {
        let _obj = this._obj;
        for (let k in _obj) {
            if (_obj.hasOwnProperty(k)) {
                process(k, _obj[k]);
            }
        }
        return this;
    }
};
function Config(config) {
    let self = this;
    new _Object(config)._each(function(key, value) {
        self[key] = value;
    });
}

Config.prototype = {
    api_server: 'api.geetest.com',
    protocol: 'http://',
    type_path: '/gettype.php',
    fallback_config: {
        slide: {
            static_servers: ['static.geetest.com', 'dn-staticdown.qbox.me'],
            type: 'slide',
            slide: '/static/js/geetest.0.0.0.js'
        },
        fullpage: {
            static_servers: ['static.geetest.com', 'dn-staticdown.qbox.me'],
            type: 'fullpage',
            fullpage: '/static/js/fullpage.0.0.0.js'
        }
    },
    _get_fallback_config: function() {
        let self = this;
        if (isString(self.type)) {
            return self.fallback_config[self.type];
        } else if (self.new_captcha) {
            return self.fallback_config.fullpage;
        } else {
            return self.fallback_config.slide;
        }
    },
    _extend: function(obj) {
        let self = this;
        new _Object(obj)._each(function(key, value) {
            self[key] = value;
        });
    }
};
let isNumber = function(value) {
    return typeof value === 'number';
};
let isString = function(value) {
    return typeof value === 'string';
};
let isBoolean = function(value) {
    return typeof value === 'boolean';
};
let isObject = function(value) {
    return typeof value === 'object' && value !== null;
};
let isFunction = function(value) {
    return typeof value === 'function';
};
let callbacks = {};
let status = {};
let random = function() {
    return parseInt(Math.random() * 10000) + new Date().valueOf();
};
let loadScript = function(url, cb) {
    let script = document.createElement('script');
    script.charset = 'UTF-8';
    script.async = true;
    script.onerror = function() {
        cb(true);
    };
    let loaded = false;
    script.onload = script.onreadystatechange = function() {
        if (
            !loaded &&
                (!script.readyState ||
                    'loaded' === script.readyState ||
                    'complete' === script.readyState)
        ) {
            loaded = true;
            setTimeout(function() {
                cb(false);
            }, 0);
        }
    };
    script.src = url;
    head.appendChild(script);
};
let normalizeDomain = function(domain) {
    return domain.replace(/^https?:\/\/|\/$/g, '');
};
let normalizePath = function(path) {
    path = path.replace(/\/+/g, '/');
    if (path.indexOf('/') !== 0) {
        path = '/' + path;
    }
    return path;
};
let normalizeQuery = function(query) {
    if (!query) {
        return '';
    }
    let q = '?';
    new _Object(query)._each(function(key, value) {
        if (isString(value) || isNumber(value) || isBoolean(value)) {
            q =
                    q +
                    encodeURIComponent(key) +
                    '=' +
                    encodeURIComponent(value) +
                    '&';
        }
    });
    if (q === '?') {
        q = '';
    }
    return q.replace(/&$/, '');
};
let makeURL = function(protocol, domain, path, query) {
    domain = normalizeDomain(domain);

    let url = normalizePath(path) + normalizeQuery(query);
    if (domain) {
        url = protocol + domain + url;
    }

    return url;
};
let load = function(protocol, domains, path, query, cb) {
    let tryRequest = function(at) {
        let url = makeURL(protocol, domains[at], path, query);
        loadScript(url, function(err) {
            if (err) {
                if (at >= domains.length - 1) {
                    cb(true);
                } else {
                    tryRequest(at + 1);
                }
            } else {
                cb(false);
            }
        });
    };
    tryRequest(0);
};
let jsonp = function(domains, path, config, callback) {
    if (isObject(config.getLib)) {
        config._extend(config.getLib);
        callback(config);
        return;
    }
    if (config.offline) {
        callback(config._get_fallback_config());
        return;
    }
    let cb = 'geetest_' + random();
    window[cb] = function(data) {
        if (data.status === 'success') {
            callback(data.data);
        } else if (!data.status) {
            callback(data);
        } else {
            callback(config._get_fallback_config());
        }
        window[cb] = undefined;
        try {
            delete window[cb];
        } catch (e) {
            //
        }
    };
    load(
        config.protocol,
        domains,
        path,
        {
            gt: config.gt,
            callback: cb
        },
        function(err) {
            if (err) {
                callback(config._get_fallback_config());
            }
        }
    );
};
let throwError = function(errorType, config) {
    let errors = {
        networkError: '网络错误'
    };
    if (typeof config.onError === 'function') {
        config.onError(errors[errorType]);
    } else {
        throw new Error(errors[errorType]);
    }
};
let detect = function() {
    return !!window.Geetest;
};
if (detect()) {
    status.slide = 'loaded';
}
let initGeetest = function(userConfig, callback) {
    let config = new Config(userConfig);
    if (userConfig.https) {
        config.protocol = 'https://';
    } else if (!userConfig.protocol) {
        config.protocol = window.location.protocol + '//';
    }
    jsonp(
        [config.api_server || config.apiserver],
        config.type_path,
        config,
        function(newConfig) {
            let type = newConfig.type;
            let init = function() {
                config._extend(newConfig);
                callback(new window.Geetest(config));
            };
            callbacks[type] = callbacks[type] || [];
            let s = status[type] || 'init';
            if (s === 'init') {
                status[type] = 'loading';
                callbacks[type].push(init);
                load(
                    config.protocol,
                    newConfig.static_servers || newConfig.domains,
                    newConfig[type] || newConfig.path,
                    null,
                    function(err) {
                        if (err) {
                            status[type] = 'fail';
                            throwError('networkError', config);
                        } else {
                            status[type] = 'loaded';
                            let cbs = callbacks[type];
                            for (
                                let i = 0, len = cbs.length;
                                i < len;
                                i = i + 1
                            ) {
                                let cb = cbs[i];
                                if (isFunction(cb)) {
                                    cb();
                                }
                            }
                            callbacks[type] = [];
                        }
                    }
                );
            } else if (s === 'loaded') {
                init();
            } else if (s === 'fail') {
                throwError('networkError', config);
            } else if (s === 'loading') {
                callbacks[type].push(init);
            }
        }
    );
};

let submitWithGeetest = (fn, type = 0, register = ()=> {}, closeCb = ()=> {})=> {
    let geetestData = {};
    function showGeetest() {
        return new Promise((resolve, reject)=> {
            register()
                .then(data=> {
                    data.product = 'bind';
                    data.offline = !data.success;
                    delete data.success;
                    initGeetest(data, captchaObj => {
                        captchaObj
                            .onReady(() => {
                                captchaObj.verify();
                            })
                            .onSuccess(() => {
                                geetestData = captchaObj.getValidate();
                                resolve();
                            })
                            .onError(() => {
                                captchaObj.reset();
                            })
                            .onClose(() => {
                                let msg = closeCb();
                                if(msg.reShow) {
                                    setTimeout(() => {
                                        captchaObj.verify();
                                    }, msg.wait || 1500);
                                } else {
                                    reject({
                                        status: false,
                                        msg: 'close'
                                    });
                                }
                            });
                    });
                })
                .catch(e => {
                    console.log(e);
                    reject({
                        status: false,
                        msg: 'register geetest fail'
                    });
                });
        });
    }
    function submit() {
        return new Promise((resolve, reject)=> {
            fn(geetestData).then(res=> {
                if (parseInt(res.test[1]) % 2 === 0) {
                    if (geetestData.geetest_challenge) {
                        reject({
                            status: false,
                            msg: 'fail'
                        });
                    } else {
                        showGeetest()
                            .then(()=> {
                                submit().then(res=> resolve(res)).catch(err=> reject(err));
                            });
                    }
                } else {
                    resolve({
                        status: true,
                        res,
                        msg: 'success'
                    });
                }

            }).catch(reject);
        });
    }
    if (type === 1 && (!geetestData || !geetestData.geetest_challenge)) {
        return showGeetest()
            .then(()=> {
                return submit();
            });
    }
    return submit();
};

export default submitWithGeetest;