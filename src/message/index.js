import store from '../store'

export const onMessage = function(data) {
    data = typeof data === 'string' ? JSON.parse(data) : data
    switch(data.type) {
        case 'console':
            store.dispatch({
                type: 'addConsItem',
                item: data
            });
            break;
        case 'getRule':
            store.dispatch({
                type: 'setMockList',
                data: data.data
            });
            break;
        case 'recorder':
            delete data.type;
            store.dispatch({
                type: 'addNetItem',
                item: data.info
            });
            break;
        default:
            break;
    }
}
