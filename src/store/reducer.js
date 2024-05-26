import { Tkb, UserApi } from '~/api/Api';

const initValue = {
    theme: localStorage.getItem('theme') || 'light',
    user: UserApi.loadFromLocalStorage(),
    tkbs_local_store: Tkb.loadFromLocalStorage(),
};

function reducre(state, action) {
    console.log(state, action);
    const { type, value } = action;
    switch (type) {
        case 'SET-THEME':
            localStorage.setItem('theme', value);
            state.theme = value;
            break;

        case 'SET-USER':
            state.user = value;
            break;

        default:
            break;
    }

    return { ...state };
}

export { initValue };
export default reducre;
