import io from 'socket.io-client';
const Ws = {
    install: function(Vue, options) {
        function Ws(options) {
            const ws = io('http://127.0.0.1:8002?token=front', {
                path: '/ws_console',
            });
            ws.on('connect', () => {
                console.log('connect')
            });
            ws.on('error', () => {
                console.log('error')
            });
            ws.on('connect_error', () => {
                console.log('connect_error')
            });
            ws.on('ws_console_server', (data) => {
                options.onmessage(data);
            })
            this.ws = ws;
        }
        Ws.prototype.send = function(data, errorHandler) {
            this.ws.emit('ws_console_front', data, (error) => {
                typeof errorHandler === 'function' && errorHandler.apply(this, error);
            })
        };

        Vue.prototype.$ws = new Ws(options);
    }
};
export default Ws;
