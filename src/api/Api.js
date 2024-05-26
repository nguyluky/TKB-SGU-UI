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

    /**
     *
     * @param {String} url
     * @param {Object} headers
     * @param {String} body
     * @returns {ApiResponseBase}
     */
    static async PUT(url, headers, body) {
        return this.send(url, 'PUT', headers, body);
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
    constructor(
        baseUrl,
        token,
        tkbId,
        name,
        tkb_describe,
        thumbnails,
        ma_hoc_phans,
        id_to_hocs,
        access,
        created,
        local,
    ) {
        this.baseUrl = baseUrl;
        this.token = token;
        this.tkbId = tkbId;
        this.name = name;
        this.tkb_describe = tkb_describe;
        this.thumbnails = thumbnails;
        this.ma_hoc_phans = ma_hoc_phans || [];
        this.id_to_hocs = id_to_hocs || [];
        this.access = access;
        this.created = new Date(created);
        this.local = local;
    }

    async updateName(newName) {
        this.name = newName;

        var resp = await sendReq.PUT(
            this.baseUrl + '/tkbs/' + this.tkbId,
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.token,
            },
            JSON.stringify({
                name: this.name,
            }),
        );

        return resp;
    }

    async update() {
        var resp = await sendReq.PUT(
            this.baseUrl + '/tkbs/' + this.tkbId,
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.token,
            },
            JSON.stringify({
                name: this.name,
                tkb_describe: this.tkb_describe,
                thumbnails: null,
                id_to_hocs: this.id_to_hocs,
                ma_hoc_phans: this.ma_hoc_phans,
            }),
        );

        return resp;
    }

    async delete() {}

    async createInvite() {}

    async getPeoples() {}

    async changePermission(userId, newRule) {}

    async kid() {}

    async saveAs(name, description, thumbmail, isPublic) {}

    saveToLocal() {}

    static async getTkb(baseUrl, token, tkbId) {
        // console.log(token);
        var resp = await sendReq.GET(baseUrl + '/tkbs/' + tkbId, {
            Authorization: 'Bearer ' + token,
        });

        if (resp.code !== 200) {
            return resp;
        }

        const { name, tkb_describe, thumbnails, ma_hoc_phans, id_to_hocs, rule, created } = resp.data[0];
        return new Tkb(
            baseUrl,
            token,
            tkbId,
            name,
            tkb_describe,
            thumbnails,
            ma_hoc_phans,
            id_to_hocs,
            rule,
            created,
            false,
        );
    }

    static loadFromLocalStorage() {
        var tkbs = localStorage.getItem('tkb_store') || [];
        return tkbs.map((name, tkb_describe, thumbnails, ma_hoc_phans, id_to_hocs, created, id) => {
            return new Tkb(null, null, id, name, tkb_describe, thumbnails, ma_hoc_phans, id_to_hocs, 0, created, true);
        });
    }
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

    createNewTkb() {
        return new Tkb(this.baseUrl, this.token, null, 'Untitled', null, null, [], [], 0, new Date().toISOString());
    }

    async getDsTkb() {
        return await sendReq.GET(baseUrl + '/tkbs', {
            Authorization: 'Bearer ' + this.token,
        });
    }

    async getTkb(tkbId) {
        return await Tkb.getTkb(this.baseUrl, this.token, tkbId);
    }

    async joinTkb() {}

    static loadFromLocalStorage() {
        var token = window.localStorage.getItem('token');
        if (token) {
            return new UserApi(baseUrl, token);
        }
        return new UserApi(baseUrl, '');
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
     * @returns {Promise<ApiResponseBase>}
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
        // console.log('ok');
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
