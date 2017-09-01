const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const fse = require('fs-extra');
const ipLib = require('ip');
const {handleNetwork} = require('../network/index');
const MockRule = require('../mock/index');

module.exports = {
    summary: 'my test rule for anyproxy',
    * beforeSendRequest(requestDetail) {
        return new Promise((resolve, reject) => {
            MockRule.mock(requestDetail.url).then(response => {
                if(!response) {
                    resolve({
                        request: requestDetail
                    });
                } else {
                    // handleNetwork(requestDetail, response);
                    resolve({response});
                }
            })
        });
    },
    * beforeSendResponse(requestDetail, responseDetail) {
        return new Promise((resolve, reject) => {
            const newResponse = responseDetail.response;
            // handleNetwork(requestDetail, newResponse);
            if(requestDetail.url.indexOf('ws_console=true') > -1) {
                const str = iconv.decode(responseDetail.response.body, 'win1251');
                $ = cheerio.load(str);
                const myIp = global.__momo.ip||ipLib.address(), webPort = global.__momo.webPort||8002;
                const scriptStr =  `<script src="//${myIp}:${webPort}/ws_console.js"></script>`;
                $('head').prepend(scriptStr);
                newResponse.body = $.html();
                resolve({
                    response: newResponse
                });
            } else {
                resolve({
                    response: newResponse
                });
            }
        })
    },
    * beforeDealHttpsRequest(requestDetail) {
        console.log('beforeDealHttpsRequest')
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    response: requestDetail
                });
            }, 0);
        })
    },

    * onError(requestDetail, error) {
        console.log('onError');
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    response: error
                });
            }, 0);

        })
    },

    * onConnectError(requestDetail, error) {
        console.log('onConnectError');
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    response: error
                });
            }, 0);
        })
    }
};
