const iconv = require('iconv-lite');
const uid = require('uid');
const mime = require('mime');

const NetworkService = (function() {
    let __Wss = null;
    const __cache = [];
    const __bodyMap = new Map();
    //设置wss
    const setWss = function(wss) {
        __Wss = wss;
    };
    const __sendCache = function() {
        if(__cache.length < 1) return;
        let data = null;
        while(data = __cache.shift()) {
            __Wss.sendMyClient(data);
        }
    };
    const __getType = function(url) {
        let type = mime.lookup(url) || 'unkown';
        type = type.split('/').pop();
        if(type === 'octet-stream') type = 'document';
        return type;
    };
    const handleNetwork = function(request, response, rule) {
        const list = {
            id: uid(),
            rule: rule || '-',
            url: request.url || '',
            type: __getType(request.url),
            StatusCode: response.statusCode || '500',
        };
        const general = {};
        request = request.requestOptions;
        for(let i in request) {
            if(request.hasOwnProperty(i) && i !== 'headers') {
                general[i] = request[i]
            }
        }
        const reqHeaders = request.headers || {};
        const resHeaders = response.header || {};
        __bodyMap.set(list['id'], response.body);
        const data = {list, general, reqHeaders, resHeaders, kind: 'network'};
        if(__Wss) {
            __sendCache();
            __Wss.sendMyClient(data);
        } else {
            __cache.push(data);
        }
    };
    const returnBody = function(options) {
        return iconv.decode(__bodyMap.get(options.id) || '', 'win1251');

    };
    const cleanBody = function() {
        __bodyMap.clear();
    };
    const sendRecorder = function(info) {
        if(__Wss) {
            __Wss.sendMyClient(Object.assign({}, info, {kind: 'recorder'}));
        }
    };
    return {
        setWss,
        handleNetwork,
        returnBody,
        cleanBody,
        sendRecorder
    }
})();
module.exports = NetworkService;
