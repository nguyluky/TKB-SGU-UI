const initValue = {
    theme: localStorage.getItem('theme') === 'true',
    user: null,
};

function reducre(state, action) {
    console.log(state, action);
    switch (action.type) {
        case 'THEME-SET-DARK':
            document.body.className = 'dark-mode';
            localStorage.setItem('theme', true);
            state.theme = true;
            break;

        case 'THEME-SET-LIGHT':
            document.body.className = '';
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
