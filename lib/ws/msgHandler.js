const NetworkService = require('../network/index');
const MockRule = require('../mock/index');
function msgHandler(data, wss) {
    if(data.flag === 'ws_console') {
        Object.assign(data, {kind: 'console'});
        wss.sendMyClient(data);
    } else if(data.flag === 'ws_console_front') {
        switch(data.type) {
            case 'exec':
                Object.assign(data);
                wss.sendClients(data);
                break;
            case 'cleanBody':
                NetworkService.cleanBody();
                wss.sendMyClient({kind: 'cleanBody'});
                break;
            case 'getRule':
                const rule = MockRule.getRule();
                wss.sendMyClient({kind: 'getRule', rule});
                break;
            case 'setRule':
                MockRule.setRule(data.rule);
                wss.sendMyClient({kind: 'getRule', rule: MockRule.getRule()});
                break;
        }
    }
}
module.exports = msgHandler;
