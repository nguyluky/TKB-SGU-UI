const initValue = {
    ds_nhom_to: null,
    ds_mon_hoc: null,
    xo_tin_chi: 0,
    hoc_phan_da_chon: ['813102', '813103', '861302'],
    tiet_templay: '',
    tiet_da_chon: {},
    tkbs: null,
};

function reducre(state, action) {
    var { path, value } = action;
    if (Object.hasOwn(state, path)) state[path] = value;
    // console.log(state);
    return { ...state };
}

export { initValue };
export default reducre;
