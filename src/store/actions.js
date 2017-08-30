import * as types from './mutation-types'
export const addConsItem = ({commit}, item) => {
    commit(types.ADD_CONSOLE_ITEM, item)
}
export const cleanConsList = ({commit}) => {
    commit(types.CLEAN_CONSOLE_LIST)
}
export const addNetItem = ({commit}, item) => {
    commit(types.ADD_NET_ITEM, item)
}
export const cleanNetList = ({commit}) => {
    commit(types.CLEAN_NET_LIST)
}
export const setNetType = ({commit}, type) => {
    commit(types.SET_NET_TYPE, type)
}
export const setMockList = ({commit}, item) => {
    commit(types.SET_MOCK_LIST, item)
}
export const cleanMockList = ({commit}) => {
    commit(types.CLEAN_MOCK_LIST)
}

export const setServerInfo = ({commit}, item) => {
    commit(types.SET_SERVER_INFO, item)
}
