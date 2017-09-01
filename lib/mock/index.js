const fse = require('fs-extra');
const path = require('path');
const mime = require('mime');
const proxyUtil = require('../proxy/util');

const ruleJson = (function() {
    let filepath = path.join(proxyUtil.getAnyProxyHome(), 'rule.json');
    fse.ensureFileSync(filepath);
    return filepath;
})();
const MockRule = (function () {
    let rule = [];
    const init = (function(wss) {
        fse.readJson(ruleJson).then(data => {
            rule = data;
        }).catch(error => {
            rule = [{
                name: 'rule1',
                isActive: true,
                rules: {
                    "http://example.com": "/path/to/file"
                }
            }];
        })
    })();
    const __findRule = function(url) {
        let result = false;
        rule.forEach(item => {
            if(!item.isActive) return;
            for(let r in item.rules) {
                if(url.indexOf(r) > -1) {
                    result = item.rules[r];
                }
            }
        })
        return result;
    };
    const handleError = function(error) {
        console.log(error);
    };
    const mock = function(url) {
        return new Promise((resolve, reject) => {
            const ruleValue = __findRule(url);
            if(!ruleValue) resolve(false);
            const response = {
                statusCode: 200,
                header: {
                    'Content-Type': 'application/json'
                },
            }
            //ruleValue 为字符串时默认为文件路径，否则为作为json数据返回
            if(typeof ruleValue === 'string') {
                response.header['Content-Type'] = mime.lookup(ruleValue);
                fse.readFile(ruleValue).then(data => {
                    response.body = data;
                    resolve(response);
                }).catch(error => {
                    handleError(error);
                    resolve(false);
                })
            } else {
                response.body = JSON.stringify(ruleValue);
                resolve(response);
            }


        })
    };
    const getRule = function() {
        return rule;
    };
    const setRule = function(json) {
        rule = json;
        fse.writeJson(ruleJson, json).then(() => {
            console.log('success');
        }).catch(error => {
            handleError(error);
        })
    }
    return {
        mock,
        setRule,
        getRule,
    }
})();
module.exports = MockRule;
