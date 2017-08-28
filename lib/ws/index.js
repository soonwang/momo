const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;
const msgHandler = require('./msgHandler');

function WsServer(options) {
    const self = this;
    const wss = new WebSocketServer({port: options.port});
    const noop = function() {};
    self.myClient = null;

    //发送到界面
    self.sendMyClient = wss.sendMyClient = function(data) {
        data = Object.assign(data, {flag: 'ws_console_server'});
        self.myClient && self.myClient.readyState === WebSocket.OPEN && self.myClient.send(JSON.stringify(data))
    };
    //发送到所有连接的客户端（除了界面）
    self.sendClients = wss.sendClients = function(data) {
        data = Object.assign(data, {flag: 'ws_console_server'});
        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN && !client.isMyClient) {
                client.send(JSON.stringify(data));
            }
        })
    }
    //广播
    self.broadcast = wss.broadcast = function(data) {
        data = Object.assign(data, {flag: 'ws_console_server'});
        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        })
    };
    self.wss = wss;
    wss.on("connection", (ws, req) => {
        ws.on('message', (data) => {
            console.log(data);
            data = typeof data === 'string' ? JSON.parse(data) : data;
            if(data.type === 'front_first_connect' && data.flag === 'ws_console_front') {
                self.myClient = ws;
                ws.isMyClient = true;
            } else {
                msgHandler(data, wss);
            }
        });
        ws.on('error', (error) => {
            typeof options.onerror === 'function' && options.onerror(error);
        });
        ws.on('close', (data) => {
            typeof options.onclose === 'function' && options.onclose(data);
        })
    });
    wss.on('close', noop);
}

WsServer.prototype.closeAll = function() {
    this.wss.close();
};
module.exports = WsServer;
