import store from '../store'

export const onMessage = function(event) {
    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
    if(data.flag !== 'ws_console_server') return;
    switch(data.kind) {
        case 'console':
            delete data.flag;
            delete data.kind;
            store.dispatch({
                type: 'addConsItem',
                item: data
            });
            break;
        case 'getRule':
            store.dispatch({
                type: 'setMockList',
                item: data.rule
            });
            break;
        case 'recorder':
            delete data.flag;
            delete data.kind;
            store.dispatch({
                type: 'addNetItem',
                item: data
            });
            break;
        default:
            break;
    }
}
