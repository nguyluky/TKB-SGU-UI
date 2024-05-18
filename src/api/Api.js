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

class TkbSguApi {
    static async login(userName, password) {
        console.log(userName, password);
    }

    static async signup(userName, password, email, type_signup) {
        console.log('sign_up');
    }

    static async verifyEmail(verifyId) {
        console.log('verify');
    }

    static async getDsNhomHoc() {
        console.log('ok');
        var resp = await fetch(baseUrl + '/api/v1/ds-nhom-hoc');

        return await resp.json();
    }
}

export default TkbSguApi;
