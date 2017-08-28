const fse = require('fs-extra');
const mime = require('mime');

const MockRule = (function () {
    let rule = [];
    const init = (function(wss) {
        fse.readJson('./lib/mock/rule.json').then(data => {
            rule = data;
        }).catch(error => {
            console.log('readJson error', error);
            rule = [];
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
            const filepath = __findRule(url);
            if(!filepath) resolve(false);
            const response = {
                statusCode: 200,
                header: {
                    'Content-Type': mime.lookup(filepath)
                },
            }
            fse.readFile(filepath).then(data => {
                response.body = data;
                resolve(response);
            }).catch(error => {
                handleError(error);
                resolve(false);
            })
        })
    };
    const getRule = function() {
        return rule;
    };
    const setRule = function(json) {
        rule = json;
        fse.writeJson('./lib/mock/rule.json', json).then(() => {
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
