/**
 * anyproxy 4.x
 * @type {[type]}
 */

'use strict';

const http = require('http'),
  https = require('https'),
  async = require('async'),
  color = require('colorful'),
  certMgr = require('./certMgr'),
  Recorder = require('./recorder'),
  logUtil = require('./log'),
  util = require('./util'),
  events = require('events'),
  co = require('co');

const T_TYPE_HTTP = 'http',
  T_TYPE_HTTPS = 'https',
  DEFAULT_TYPE = T_TYPE_HTTP;

const PROXY_STATUS_INIT = 'INIT';
const PROXY_STATUS_READY = 'READY';
const PROXY_STATUS_CLOSED = 'CLOSED';

/**
 *
 * @class ProxyCore
 * @extends {events.EventEmitter}
 */
class ProxyCore extends events.EventEmitter {

  /**
   * Creates an instance of ProxyCore.
   *
   * @param {object} config - configs
   * @param {number} config.port - port of the proxy server
   * @param {object} [config.rule=null] - rule module to use
   * @param {string} [config.type=http] - type of the proxy server, could be 'http' or 'https'
   * @param {strign} [config.hostname=localhost] - host name of the proxy server, required when this is an https proxy
   * @param {boolean} [config.forceProxyHttps=false] - if proxy all https requests
   * @param {boolean} [config.silent=false] - if keep the console silent
   * @param {boolean} [config.dangerouslyIgnoreUnauthorized=false] - if ignore unauthorized server response
   * @param {object} [config.recorder] - recorder to use
   *
   * @memberOf ProxyCore
   */
  constructor(config) {
    super();
    config = config || {};

    this.status = PROXY_STATUS_INIT;
    this.proxyPort = config.port;
    this.proxyType = /https/i.test(config.type || DEFAULT_TYPE) ? T_TYPE_HTTPS : T_TYPE_HTTP;
    this.proxyHostName = config.hostname || 'localhost';
    this.recorder = config.recorder;

    if (parseInt(process.versions.node.split('.')[0], 10) < 4) {
      throw new Error('node.js >= v4.x is required for anyproxy');
    } else if (config.forceProxyHttps && !certMgr.ifRootCAFileExists()) {
      throw new Error('root CA not found. can not intercept https'); // TODO : give a reference to user
    } else if (this.proxyType === T_TYPE_HTTPS && !config.hostname) {
      throw new Error('hostname is required in https proxy');
    } else if (!this.proxyPort) {
      throw new Error('proxy port is required');
    } else if (!this.recorder) {
      throw new Error('recorder is required');
    }

    this.httpProxyServer = null;
    this.requestHandler = null;

    // copy the rule to keep the original proxyRule independent
    this.proxyRule = config.rule || {};

    if (config.silent) {
      logUtil.setPrintStatus(false);
    }



    // init recorder
    this.recorder = config.recorder;

    // init request handler
    const RequestHandler = util.freshRequire('./requestHandler');
    this.requestHandler = new RequestHandler({
      forceProxyHttps: !!config.forceProxyHttps,
      dangerouslyIgnoreUnauthorized: !!config.dangerouslyIgnoreUnauthorized
    }, this.proxyRule, this.recorder);
  }

  /**
  * manage all created socket
  * for each new socket, we put them to a map;
  * if the socket is closed itself, we remove it from the map
  * when the `close` method is called, we'll close the sockes before the server closed
  *
  * @param {Socket} the http socket that is creating
  * @returns undefined
  * @memberOf ProxyCore
  */
  handleExistConnections(socket) {
    const self = this;
    self.socketIndex ++;
    const key = `socketIndex_${self.socketIndex}`;
    self.socketPool[key] = socket;

    // if the socket is closed already, removed it from pool
    socket.on('close', () => {
      delete self.socketPool[key];
    });
  }
  /**
   * start the proxy server
   *
   * @returns ProxyCore
   *
   * @memberOf ProxyCore
   */
  start() {
    const self = this;
    self.socketIndex = 0;
    self.socketPool = {};

    if (self.status !== PROXY_STATUS_INIT) {
      throw new Error('server status is not PROXY_STATUS_INIT, can not run start()');
    }
    async.series(
      [
        //creat proxy server
        function (callback) {
          if (self.proxyType === T_TYPE_HTTPS) {
            certMgr.getCertificate(self.proxyHostName, (err, keyContent, crtContent) => {
              if (err) {
                callback(err);
              } else {
                self.httpProxyServer = https.createServer({
                  key: keyContent,
                  cert: crtContent
                }, self.requestHandler.userRequestHandler);
                callback(null);
              }
            });
          } else {
            self.httpProxyServer = http.createServer(self.requestHandler.userRequestHandler);
            callback(null);
          }
        },

        //handle CONNECT request for https over http
        function (callback) {
          self.httpProxyServer.on('connect', self.requestHandler.connectReqHandler);

          callback(null);
        },

        function (callback) {
          // remember all sockets, so we can destory them when call the method 'close';
          self.httpProxyServer.on('connection', (socket) => {
            self.handleExistConnections.call(self, socket);
          });
          callback(null);
        },

        //start proxy server
        function (callback) {
          self.httpProxyServer.listen(self.proxyPort);
          callback(null);
        },
      ],

      //final callback
      (err, result) => {
        if (!err) {
          const tipText = (self.proxyType === T_TYPE_HTTP ? 'Http' : 'Https') + ' proxy started on port ' + self.proxyPort;
          logUtil.printLog(color.green(tipText));

          if (self.webServerInstance) {
            const webTip = 'web interface started on port ' + self.webServerInstance.webPort;
            logUtil.printLog(color.green(webTip));
          }

          let ruleSummaryString = '';
          const ruleSummary = this.proxyRule.summary;
          if (ruleSummary) {
            co(function *() {
              if (typeof ruleSummary === 'string') {
                ruleSummaryString = ruleSummary;
              } else {
                ruleSummaryString = yield ruleSummary();
              }

              logUtil.printLog(color.green(`Active rule is: ${ruleSummaryString}`));
            });
          }

          self.status = PROXY_STATUS_READY;
          self.emit('ready');
        } else {
          const tipText = 'err when start proxy server :(';
          logUtil.printLog(color.red(tipText), logUtil.T_ERR);
          logUtil.printLog(err, logUtil.T_ERR);
          self.emit('error', {
            error: err
          });
        }
      }
    );

    return self;
  }


  /**
   * close the proxy server
   *
   * @returns ProxyCore
   *
   * @memberOf ProxyCore
   */
  close() {
    // clear recorder cache
    return new Promise((resolve) => {
      if (this.httpProxyServer) {
        // destroy conns & cltSockets when close proxy server
        for (const [key, conn] of this.requestHandler.conns) {
          logUtil.printLog(`destorying https connection : ${key}`);
          conn.end();
        }

        for (const [key, cltSocket] of this.requestHandler.cltSockets) {
          logUtil.printLog(`endding https cltSocket : ${key}`);
          cltSocket.end();
        }

        if (this.socketPool) {
          for (const key in this.socketPool) {
            this.socketPool[key].destroy();
          }
        }

        this.httpProxyServer.close((error) => {
          if (error) {
            console.error(error);
            logUtil.printLog(`proxy server close FAILED : ${error.message}`, logUtil.T_ERR);
          } else {
            this.httpProxyServer = null;

            this.status = PROXY_STATUS_CLOSED;
            logUtil.printLog(`proxy server closed at ${this.proxyHostName}:${this.proxyPort}`);
          }
          resolve(error);
        });
      } else {
        resolve();
      }
    })
  }
}


module.exports.ProxyCore = ProxyCore;
module.exports.ProxyRecorder = Recorder;
module.exports.utils = {
  systemProxyMgr: require('./systemProxyMgr'),
  certMgr,
};
