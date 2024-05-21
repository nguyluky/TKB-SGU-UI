class ApiResponseBase {
    code = 0;
    msg = '';
    success = false;
    data = null;

    constructor(code, msg, success, data) {
        this.code = code;
        this.msg = msg;
        this.success = success;
        this.data = data;
    }

    static fromJson(ob) {
        return new ApiResponseBase(ob.code, ob.msg, ob.success, ob.data);
    }
}

class sendReq {
    /**
     *
     * @param {String} url
     * @param {Object} headers
     * @param {String} body
     * @returns {ApiResponseBase}
     */
    static async POST(url, headers, body) {
        return this.send(url, 'POST', headers, body);
    }

    /**
     *
     * @param {String} url
     * @param {Object} headers
     * @param {String} body
     * @returns {ApiResponseBase}
     */
    static async GET(url, headers, body) {
        return this.send(url, 'GET', headers, body);
    }

    /**
     *
     * @param {String} url
     * @param {Object} headers
     * @param {String} body
     * @returns {ApiResponseBase}
     */
    static async DELETE(url, headers, body) {
        return this.send(url, 'DELETE', headers, body);
    }

    static async send(url, method, headers, body) {
        var resp = await fetch(url, {
            method: method,
            headers: headers,
            body: body,
        });

        return resp.json();
    }
}

var baseUrl = 'https://tkbsgusort.dev.vn/api/v1';
class Tkb {
    constructor(token, tkbId) {
        this.token = token;
        this.tkbId = tkbId;
    }

    async update(name, description, thumbmail, isPublic) {}

    async delete() {}

    async createInvite() {}

    async getPeoples() {}

    async changePermission(userId, newRule) {}

    async kid() {}
}

class UserApi {
    constructor(baseUrl, token) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    async changePassword(oldPassword, newPassword) {
        return await sendReq.POST(
            baseUrl + '/auth/change-password',
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.token,
            },
            JSON.stringify({
                oldpassword: 'passwordtest1',
                password: 'passwordtest2',
            }),
        );
    }

    async getAllToken() {
        return await sendReq.GET(baseUrl + '/auth/tokens', {
            Authorization: 'Bearer ' + this.token,
        });
    }

    async deleteToken(token) {
        return await sendReq.DELETE(baseUrl + '/auth/tokens/' + token, {
            Authorization: 'Bearer ' + this.token,
        });
    }

    async createNewTkb(name, description, thumbmail, isPublic) {
        console.log('createNewTkb');
    }

    async getDsTkb() {
        return await sendReq.GET(baseUrl + '/tkbs', {
            Authorization: 'Bearer ' + this.token,
        });
    }

    async getTkb(tkbId) {}

    async joinTkb() {}

    static loadFromLocalStorage() {
        var token = window.localStorage.getItem('token');
        if (token) {
            return new UserApi(baseUrl, token);
        }
        return null;
    }
}

class TkbSguApi {
    /**
     *
     * @param {String} userName
     * @param {String} password
     * @returns {UserApi | ApiResponseBase}
     */
    static async login(userName, password) {
        var resp = await fetch(baseUrl + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: userName,
                password: password,
            }),
        });

        const jsonResp = ApiResponseBase.fromJson(await resp.json());

        if (jsonResp.success) {
            window.localStorage.setItem('token', jsonResp.data.accessToken);
            return new UserApi(baseUrl, jsonResp.data.accessToken);
        }
        return jsonResp;
    }

    /**
     *
     * @param {String} userName
     * @param {String} password
     * @param {String} email
     * @param {String} type_signup
     * @returns {ApiResponseBase}
     */
    static async signup(userName, password, email, type_signup) {
        var resp = await fetch(baseUrl + '/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userName,
                password: password,
                email: email,
                type_signup: type_signup,
            }),
        });

        return await resp.json();
    }

    static async verifyEmail(verifyId) {
        var resp = await fetch(baseUrl + '/auth/verify/' + verifyId, {
            method: 'POST',
        });

        return await resp.json();
    }

    static async getDsNhomHoc() {
        console.log('ok');
        var resp = await fetch(baseUrl + '/ds-nhom-hoc');

        return await resp.json();
    }

    static async forgotPassword(email) {
        var resp = await fetch(baseUrl + '/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            }),
        });

        return await resp.json();
    }

    async resetPassword(token, newPassword) {
        var resp = await fetch(baseUrl + '/auth/reset-password?token=' + token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: 'passwordtest1',
            }),
        });

        return await resp.json();
    }
}

export { UserApi, TkbSguApi, Tkb };
export default TkbSguApi;
