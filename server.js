//WebSocket start
const NetworkService = require('./lib/network/index');
const WsServer = require('./lib/ws/index');
const wsOptions = {
    port: 8003
}
const wss = new WsServer(wsOptions);
NetworkService.setWss(wss);

//AnyProxy start
const AnyProxy = require('./lib/proxy/index');
const proxyRecorder = new AnyProxy.ProxyRecorder();
const options = {
    port: 8001,
    rule: require('./lib/mock/rule.js'),
    recorder: proxyRecorder,
    forceProxyHttps: false,
    silent: false
};
const proxyCore = new AnyProxy.ProxyCore(options);

proxyCore.on('ready', (data) => {
    console.log('ready');
});
proxyCore.on('error', (e) => {
    proxyCore.close();
});
proxyCore.start();

//webServer start
const webServer = require('./web/index');
const webOptions = {
    port: 8002,
    recorder: proxyRecorder
}
webServer.start(webOptions);
