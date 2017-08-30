/** getters **/
export const NetList = (state) => {
    if(state.NetType === 'all') return state.NetList;
    if(state.NetType === 'image') {
        return state.NetList.filter(item => {
            return item['mime'] === 'jpg' || item['mime'] === 'png' || item['mime'] === 'svg';
        })
    }
    return state.NetList.filter(item => {
        return item['mime'] === state.NetType;
    })
}
export const MockList = state => {
    return state.MockList
}
export const ConsList = state => {
    return state.ConsList
}
export const ServerInfo = state => {
    return state.ServerInfo
}
