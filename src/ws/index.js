const Ws = {
    install: function(Vue, options) {
        function Ws(options) {
            const ws = new WebSocket('ws://127.0.0.1:' + options.port);
            ws.onopen = function() {
                var message = {
                    flag: 'ws_console_front',
                    type: 'front_first_connect'
                };
                ws.send(JSON.stringify(message));
                setTimeout(function() {
                    message.type = 'getRule';
                    ws.send(JSON.stringify(message))
                }, 100);
                typeof options.onopen === 'function' && options.onopen.apply(this, arguments);
            };
            ws.onclose = function() {
                console.log('closed');
                typeof options.onclose === 'function' && options.onclose.apply(this, arguments);
            };
            ws.onerror = function() {
                console.log('error');
                typeof options.onerror === 'function' && options.onerror.apply(this, arguments);
            };
            ws.onmessage = function() {
                typeof options.onmessage === 'function' && options.onmessage.apply(this, arguments);
            };
            this.ws = ws;
        }
        Ws.prototype.send = function(data, errorHandler) {
            data = Object.assign({flag: 'ws_console_front'}, data);
            this.ws.send(JSON.stringify(data), (error) => {
                typeof errorHandler === 'function' && errorHandler.apply(this, error);
            })
        };

        Vue.prototype.$ws = new Ws(options);
    }
};
export default Ws;
