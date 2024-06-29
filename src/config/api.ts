
const baseUrl = 'https://api.tkbsgusort.id.vn/api/v1'

const config = {
    baseUrl: baseUrl,

    getDsNhomHoc: () => '/ds-nhom-hoc',

    logIn: () => '/auth/login',
    logUp: () => '/auth/signup',
    verifyEmail: (token: string) => '/auth/verify/' + encodeURIComponent(token),
    forgotPassword: () => '/auth/forgot-password',
    resetPassword: (tokenResetPassword : string) => '/auth/reset-password?token=' + encodeURIComponent(tokenResetPassword),
    changePassword: () => '/auth/change-password',
    getLogInHistory: () => '/auth/tokens',
    logOut: (tokenId: string) => '/auth/tokens/' + encodeURIComponent(tokenId),

    getDsTkb: () => '/tkbs',
    createTkb: () => '/tkbs',
    getTkb: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId),
    updateTkb: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId),
    deleteTkb: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId),
    createJoinLink: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId) + '/invite',
    joinTkb: (invite_id : string) => '/tkbs/join?invite_id=' + encodeURIComponent(invite_id),
    getDsMember: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId) +'/friends',
    updateRuleMember: (tkbId: string) => '/tkbs/' + encodeURIComponent(tkbId) + '/friends/ae2f8f37-9920-4124-9530-9eaa7dd7791b',
    removeMember: (tkbId: string, memberId: string) => '/tkbs/'+ encodeURIComponent(tkbId) +'/friends/' + encodeURIComponent(memberId),
};

export default config;
