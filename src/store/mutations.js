import * as types from './mutation-types'

let mutations = {
    [types.ADD_NET_ITEM] (state, payload) {
        state.NetList.push(payload.item)
    },
    [types.CLEAN_NET_LIST] (state, payload) {
        state.NetList = [];
    },
    [types.SET_NET_TYPE] (state, payload) {
        state.NetType = payload.type;
    },
    [types.SET_MOCK_LIST] (state, payload) {
        state.MockList = payload.data
    },
    [types.CLEAN_MOCK_LIST] (state, payload) {
        state.MockList = [];
    },
    [types.ADD_CONSOLE_ITEM] (state, payload) {
        state.ConsList.push(payload.item)
    },
    [types.CLEAN_CONSOLE_LIST] (state, payload) {
        state.ConsList = [];
    },
    [types.SET_SERVER_INFO] (state, payload) {
        state.ServerInfo = payload;
    }
}
export default mutations;
