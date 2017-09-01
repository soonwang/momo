const NetworkService = require('./lib/network/index');
const AnyProxy = require('./lib/proxy/index');
const proxyRecorder = new AnyProxy.ProxyRecorder();
const WsServer = require('./lib/ws/index');
const getPort = require('./lib/util/index');
const webServer = require('./web/index');
const ipLib = require('ip');
const exec = require('child_process').exec;

function createCA() {
  if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
    AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
      // let users to trust this CA before using proxy
      if (!error) {
        const certDir = require('path').dirname(keyPath);
        console.log('The cert is generated at', certDir);
        const isWin = /^win/.test(process.platform);
        if (isWin) {
          exec('start .', { cwd: certDir });
        } else {
          exec('open .', { cwd: certDir });
        }
      } else {
        console.error('error when generating rootCA', error);
      }
    });
  }
}
createCA();

function setGlobalMomo(port) {
    global.__momo = Object.assign({}, global.__momo, port);
}
setGlobalMomo({ip: ipLib.address()});
//WebSocket start
function startWs(port) {
    const wsOptions = {
        port: port || 8003
    };
    setGlobalMomo({wsPort: wsOptions.port});
    const wss = new WsServer(wsOptions);
    NetworkService.setWss(wss);

}
//AnyProxy start
function startProxy(port) {
    const options = {
        port: port || 8001,
        rule: require('./lib/mock/rule.js'),
        recorder: proxyRecorder,
        forceProxyHttps: true,
        dangerouslyIgnoreUnauthorized: true,
        silent: false
    };
    setGlobalMomo({proxyPort: options.port});
    const proxyCore = new AnyProxy.ProxyCore(options);

    proxyCore.on('ready', (data) => {
        console.log('ready');
    });
    proxyCore.on('error', (e) => {
        proxyCore.close();
    });
    proxyCore.start();
}

//webServer start
function startWeb(port) {
    const webOptions = {
        port: port || 8002,
        recorder: proxyRecorder
    }
    setGlobalMomo({webPort: webOptions.port});
    webServer.start(webOptions);
}

getPort(startProxy, 8001);
getPort(startWeb, 8002);
// getPort(startWs, 8003);
