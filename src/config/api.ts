
let baseUrl;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    baseUrl = window.location.origin.replace('3000', '4000') + '/api/v2';
    // baseUrl = 'https://api.tkbsgusort.id.vn/api/v2';
} else {
    baseUrl = 'https://api.tkbsgusort.id.vn/api/v2';
}

const config = {
    baseUrl: baseUrl,

    getDsNhomHoc: () => '/ds-nhom-hoc',

    logIn: () => '/auth/login',
    logUp: () => '/auth/signup',

    googleOauth: () => '/auth/google',
    googleOauthCalendar: () => '/auth/google_calendar',

    verifyEmail: (token: string) => '/auth/verify/' + encodeURIComponent(token),
    forgotPassword: () => '/auth/forgot-password',
    resetPassword: (tokenResetPassword: string) =>
        '/auth/reset-password?token=' + encodeURIComponent(tokenResetPassword),
    changePassword: () => '/auth/change-password',
    getLogInHistory: () => '/auth/tokens',
    logOut: (tokenId: string) => '/auth/tokens/' + encodeURIComponent(tokenId),

    getDsTkb: () => '/tkbs',
    createTkb: () => '/tkbs',

    getTkb: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId),
    deleteTkb: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId),
    updateTkbInfo: () => '/tkbs',

    getTkbContent: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId) + '/id_to_hoc',
    updateTkbContent: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId) + '/id_to_hoc',

    getTkbContentMmh: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId) + '/ma_mon_hoc',
    updateTkbContentMmh: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId) + '/ma_mon_hoc',

    createJoinLink: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId) + '/invite',
    joinTkb: (invite_id: string) => '/tkbs/join?invite_id=' + encodeURIComponent(invite_id),
    getDsMember: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId) + '/member',
    updateRuleMember: (tkbId: string, memberId: string) =>
        '/tkbs/' + encodeURIComponent(tkbId) + '/member/' + encodeURIComponent(memberId),
    removeMember: (tkbId: string, memberId: string) =>
        '/tkbs/' + encodeURIComponent(tkbId) + '/member/' + encodeURIComponent(memberId),

    getUserInfo: () => '/user',

    getUserInfoAsQuest: (userId: string) => '/user/' + encodeURIComponent(userId),

    emailVerify: (token: string) => '/auth/verify/' + encodeURIComponent(token),

    forgetPassword: () => '/auth/forgot-password',

    resetIsalive: () => '/auth/reset-isalive',
    getQr: () => '/payment/get-qr'
};

export default config;
