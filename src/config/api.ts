
let baseUrl;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseUrl = 'http://localhost:4000/api/v1';
    // baseUrl = 'https://api.tkbsgusort.id.vn/api/v1';

} else {
    // baseUrl = 'http://localhost:4000/api/v1';

    baseUrl = 'https://api.tkbsgusort.id.vn/api/v1';
}


const config = {
    baseUrl: baseUrl,

    getDsNhomHoc: () => '/ds-nhom-hoc',

    logIn: () => '/auth/login',
    logUp: () => '/auth/signup',
    verifyEmail: (token: string) => '/auth/verify/' + encodeURIComponent(token),
    forgotPassword: () => '/auth/forgot-password',
    resetPassword: (tokenResetPassword: string) => '/auth/reset-password?token=' + encodeURIComponent(tokenResetPassword),
    changePassword: () => '/auth/change-password',
    getLogInHistory: () => '/auth/tokens',
    logOut: (tokenId: string) => '/auth/tokens/' + encodeURIComponent(tokenId),

    getDsTkb: () => '/tkbs',
    createTkb: () => '/tkbs',
    getTkb: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId),
    updateTkb: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId),
    deleteTkb: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId),
    createJoinLink: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId) + '/invite',
    joinTkb: (invite_id: string) => '/tkbs/join?invite_id=' + encodeURIComponent(invite_id),
    getDsMember: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId) + '/friends',
    updateRuleMember: (tkbId: string, memberId: string) => '/tkbs/' + encodeURIComponent(tkbId) + '/friends/' + encodeURIComponent(memberId),
    removeMember: (tkbId: string, memberId: string) => '/tkbs/' + encodeURIComponent(tkbId) + '/friends/' + encodeURIComponent(memberId),

    getUserInfo: () => '/user'
};

export default config;
