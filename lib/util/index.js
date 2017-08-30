const net = require('net');

function getPort(cb, port) {
    var server = net.createServer();
    server.listen(port, err => {
        server.once('close', () => {
            cb(port);
        });
        server.close();
    });
    server.on('error', err => {
        console.log('error in getPort:' + port);
        getPort(cb, ++port)
    })
}

module.exports = getPort;
