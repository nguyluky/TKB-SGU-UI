
const baseUrl = 'https://api.tkbsgusort.id.vn'

const config = {
    baseUrl: baseUrl,

    getDsNhomHoc: () => '/ds-nhom-hoc',

    logIn: () => '/api/v1/auth/login',
    logUp: () => '/api/v1/auth/signup',
    verifyEmail: (token: string) => '/api/v1/auth/verify/' + encodeURIComponent(token),
    forgotPassword: () => '/api/v1/auth/forgot-password',
    resetPassword: (tokenResetPassword : string) => '/api/v1/auth/reset-password?token=' + encodeURIComponent(tokenResetPassword),
    changePassword: () => '/api/v1/auth/change-password',
    getLogInHistory: () => '/api/v1/auth/tokens',
    logOut: (tokenId: string) => '/api/v1/auth/tokens/' + encodeURIComponent(tokenId),

    getDsTkb: () => '/api/v1/tkbs',
    createTkb: () => '/api/v1/tkbs',
    getTkb: (tkbId: string) => '/api/v1/tkbs/' + encodeURIComponent(tkbId),
    updateTkb: (tkbId: string) => '/api/v1/tkbs/' + encodeURIComponent(tkbId),
    deleteTkb: (tkbId: string) => '/api/v1/tkbs/' + encodeURIComponent(tkbId),
    createJoinLink: (tkbId: string) => '/api/v1/tkbs/' + encodeURIComponent(tkbId) + '/invite',
    joinTkb: (invite_id : string) => '/api/v1/tkbs/join?invite_id=' + encodeURIComponent(invite_id),
    getDsMember: (tkbId: string) => '/api/v1/tkbs/' + encodeURIComponent(tkbId) +'/friends',
    updateRuleMember: (tkbId: string) => '/api/v1/tkbs/' + encodeURIComponent(tkbId) + '/friends/ae2f8f37-9920-4124-9530-9eaa7dd7791b',
    removeMember: (tkbId: string, memberId: string) => '/api/v1/tkbs/'+ encodeURIComponent(tkbId) +'/friends/' + encodeURIComponent(memberId),
};

export default config;
