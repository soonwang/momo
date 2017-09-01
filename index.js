const Server = require('./server');
//electron start;
const {
    app,
    BrowserWindow
} = require('electron');

let win = null;

function startApp(host, port) {
    app.on('ready', function() {
        win = new BrowserWindow({
            width: 1200,
            height: 800
        });

        win.loadURL('http://'+host+':'+port+'/');

        win.on('closed', function() {
            win = null;
        });
    });

    app.on('activate', function() {
        if(win === null) {
            createWindow();
        }
    });

    app.on('window-all-closed', function() {
        if(process.plateform != 'darwin') {
            app.quit();
        }
    });
}
Server(startApp)
