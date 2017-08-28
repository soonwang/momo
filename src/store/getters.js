/** getters **/
export const NetList = state => {
    return state.NetList
}
export const XHR = state => {
    return state.NetList.filter(item => {
        return item['type'] === 'xhr';
    })
}
export const JS = state => {
    return state.NetList.filter(item => {
        return item['type'] === 'js';
    })
}
export const CSS = state => {
    return state.NetList.filter(item => {
        return item['type'] === 'css';
    })
}
export const Img = state => {
    return state.NetList.filter(item => {
        return item['type'] === 'img';
    })
}
export const Other = state => {
    return state.NetList.filter(item => {
        return item['type'] === 'other';
    })
}
export const MockList = state => {
    return state.MockList
}
export const ConsList = state => {
    return state.ConsList
}
