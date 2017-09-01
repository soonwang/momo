const router = require('express').Router();
const NetworkService = require('../lib/network/index');
const MockRule = require('../lib/mock/index');
const AnyProxy = require('../lib/proxy/index');
const util = require('../lib/proxy/util');
const certMgr = require('../lib/proxy/certMgr');
const qrCode = require('qrcode-npm');
const fs = require('fs');
const MAX_CONTENT_SIZE = 1024 * 2000; // 2000kb

const routers = function(recorder) {
    return (function(recorder) {
        router.get('/test', (req, res) => {
            res.render('test');
        });
        router.get('/', (req, res) => {
            res.sendFile('./../dist/index.html');
        });
        router.get('/api/cleanNet', (req, res) => {
          recorder.clearRecords();
          res.json({
            data: 'ok'
          });
        });
        router.get('/api/fetchCrtFile', (req, res) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          const _crtFilePath = certMgr.getRootCAFilePath();
          if (_crtFilePath) {
            res.setHeader('Content-Type', 'application/x-x509-ca-cert');
            res.setHeader('Content-Disposition', 'attachment; filename="rootCA.crt"');
            res.end(fs.readFileSync(_crtFilePath, {
              encoding: null
            }));
          } else {
            res.setHeader('Content-Type', 'text/html');
            res.end('can not file rootCA ,plase use <strong>anyproxy --root</strong> to generate one');
          }
        });
        router.get('/api/init', (req, res) => {
            const qr = qrCode.qrcode(4, 'M'),
              targetUrl = `http://${global.__momo.ip}:${global.__momo.webPort}/api/fetchCrtFile`;

            qr.addData(targetUrl);
            qr.make();
            const qrImageTag = qr.createImgTag(4);
            const isRootCAFileExists = certMgr.isRootCAFileExists();
            res.json({
              status: 'success',
              url: targetUrl,
              ip: global.__momo.ip,
              proxyPort: global.__momo.proxyPort,
              webPort: global.__momo.webPort,
              isRootCAFileExists,
              qrImgDom: qrImageTag
            });
        });
        router.get('/api/latestLog', (req, res) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          recorder.getRecords(null, 10000, (err, docs) => {
            if (err) {
              res.end(err.toString());
            } else {
              res.json(docs);
            }
          });
        });
        router.get('/api/downloadBody', (req, res) => {
          const query = req.query;
          recorder.getDecodedBody(query.id, (err, result) => {
            if (err || !result || !result.content) {
              res.json({});
            } else if (result.mime) {
              if (query.raw === 'true') {
                //TODO : cache query result
                res.type(result.mime).end(result.content);
              } else if (query.download === 'true') {
                res.setHeader('Content-disposition', `attachment; filename=${result.fileName}`);
                res.setHeader('Content-type', result.mime);
                res.end(result.content);
              }
            } else {
              res.json({

              });
            }
          });
        });
        router.get('/api/fetchBody', (req, res) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          const query = req.query;
          if (query && query.id) {
            recorder.getDecodedBody(query.id, (err, result) => {
              // 返回下载信息
              const _resDownload = function(isDownload = true) {
                res.json({
                  id: query.id,
                  type: result.type,
                  fileName: result.fileName,
                  ref: `/api/downloadBody?id=${query.id}&download=${isDownload}&raw=${!isDownload}`
                });
              };

              // 返回内容
              const _resContent = () => {
                if (util.getByteSize(result.content || '') > MAX_CONTENT_SIZE) {
                  _resDownload(true);
                  return;
                }

                res.json({
                  id: query.id,
                  type: result.type,
                  resBody: result.content
                });
              };

              if (err || !result) {
                res.json({});
              } else if (result.statusCode === 200 && result.mime) {
                if (result.type === 'json' || result.mime.indexOf('json') > -1 ||
                  result.mime.indexOf('text') === 0 ||
                  // deal with 'application/x-javascript' and 'application/javascript'
                  result.mime.indexOf('javascript') > -1) {
                  _resContent();
                } else if (result.type === 'image') {
                  _resDownload(false);
                } else {
                  _resDownload(true);
                }
              } else {
                _resContent();
              }
            });
          } else {
            res.end({});
          }
        });

        router.get('/api/getBody', function(req, res, next) {
            const id = req.query.id;
            if (!id) return res.send("代理服务器：请求参数不合法！");
            const body = NetworkService.returnBody({
                id
            });
            res.send(body);
        });
        router.get('/api/getRule', function(req, res, net) {
            res.json(MockRule.getRule());
        });
        return router;
    })(recorder)
};

module.exports = routers;
