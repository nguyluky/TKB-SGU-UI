var baseUrl = 'http://localhost';
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

    async forgotPassword() {
        console.log('forgot password');
    }

    async resetPassword(token, newPassword) {
        console.log('resetPassword');
    }

    async changePassword(oldPassword, newPassword) {
        console.log('changePassword');
    }

    async getAllToken() {
        console.log('getAllToken');
    }

    async deleteToken(token) {
        console.log('deleteToken');
    }

    async createNewTkb(name, description, thumbmail, isPublic) {
        console.log('createNewTkb');
    }

    async getDsTkb() {}

    async getTkb(tkbId) {}

    async joinTkb() {}
}

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

class TkbSguApi {
    /**
     *
     * @param {String} userName
     * @param {String} password
     * @returns {UserApi | ApiResponseBase}
     */
    static async login(userName, password) {
        var resp = await fetch(baseUrl + '/api/v1/auth/login', {
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
            return new UserApi(baseUrl, jsonResp.data.accessToken);
        }
        return jsonResp;
    }

    static async signup(userName, password, email, type_signup) {
        var resp = await fetch(baseUrl + '/api/v1/auth/signup', {
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
        var resp = await fetch(baseUrl + '/api/v1/auth/verify/' + verifyId, {
            method: 'POST',
        });

        return await resp.json();
    }

    static async getDsNhomHoc() {
        console.log('ok');
        var resp = await fetch(baseUrl + '/api/v1/ds-nhom-hoc');

        return await resp.json();
    }
}

export { UserApi, TkbSguApi };
export default TkbSguApi;
