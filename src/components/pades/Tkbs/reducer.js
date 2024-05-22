const initValue = {
    ds_nhom_to: null,
    ds_mon_hoc: null,
    xo_tin_chi: 0,
    tiet_templay: '',
    mahp_idtohoc: {},
    tkbs: null,
    currTkb: null,
};

function reducre(state, action) {
    var { path, value } = action;
    if (Object.hasOwn(state, path)) state[path] = value;
    // console.log(state);
    return { ...state };
}

export { initValue };
export default reducre;
