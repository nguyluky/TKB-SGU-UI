import { UserApi } from '~/api/Api';

const initValue = {
    theme: localStorage.getItem('theme') === 'true',
    user: UserApi.loadFromLocalStorage(),
};

function reducre(state, action) {
    console.log(state, action);
    switch (action.type) {
        case 'THEME-SET-DARK':
            localStorage.setItem('theme', true);
            state.theme = true;
            break;

        case 'THEME-SET-LIGHT':
            localStorage.setItem('theme', false);
            state.theme = false;
            break;

        case 'SET-USER':
            state.user = action.value;
            break;

        default:
            break;
    }

    return { ...state };
}

export { initValue };
export default reducre;
