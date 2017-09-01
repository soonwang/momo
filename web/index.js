const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const routes = require('./routes');
const Ws = require('./ws');

const webServer = (function() {
  const start = function(options) {
    const web = express();
    const server = http.Server(web);
    const io = socketIO(server, {
        path: '/ws_console'
    });

    Ws.start(io);
    web.set('views', path.join(__dirname, '../views'));
    web.set('view engine', 'ejs');
    const port = options.port || 8002;
    const recorder = options.recorder;
    web.use(bodyParser.json());
    web.use(bodyParser.urlencoded({
      extended: false
    }));
    web.use(express.static(path.join(__dirname, '../public')));
    web.use(express.static(path.join(__dirname, '../resource')));
    web.use(express.static(path.join(__dirname, '../dist')));
    web.use('/', routes(recorder));

    server.listen(port, function() {
      console.log('web listening on port ' + port);
    })
  };
  return {
    start
  };
})();
module.exports = webServer;
