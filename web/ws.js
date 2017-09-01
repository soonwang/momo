const NetworkService = require('../lib/network/index');
const MockRule = require('../lib/mock/index');

const FRONT = 'front',
      CLIENTS = 'clients';
const Ws = (function() {
    let myWss = null;
    const start = function(wss) {
        myWss = wss;
        myWss.on('connection', (ws) => {
            let token = ws.handshake.query.token;
            if(token === FRONT) {
                ws.join(FRONT, () => {
                    myWss.to(FRONT).emit('login', {status: 200});
                })
            } else {
                ws.join(CLIENTS, () => {
                    myWss.to(CLIENTS).emit('login', {status: 200});
                })
            }

            ws.on('ws_console_front', data => {
                frontMsgHanlder(data);
            })

            ws.on('ws_console', data => {
                Object.assign(data, {type: 'console'});
                sendFront(data);
            })
        })
    };
    const frontMsgHanlder = function(data) {
        switch (data.type) {
            case 'exec':
                Object.assign(data);
                sendClients(data);
                break;
            case 'cleanBody':
                NetworkService.cleanBody();
                sendFront({type: 'cleanBody'});
                break;
            case 'setRule':
                MockRule.setRule(data.rule);
                sendFront({type: 'getRule', data: MockRule.getRule()});
                break;
            default:
                break;
        }
    }
    const sendFront = function(data) {
        myWss.to(FRONT).emit('ws_console_server', data);
    };
    const sendClients = function(data) {
        myWss.to(CLIENTS).emit('ws_console_server', data);
    };
    return {
        start,
        sendFront,
        sendClients
    }
})()
module.exports = Ws;
