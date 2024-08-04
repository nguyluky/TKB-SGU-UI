import { io, Socket } from 'socket.io-client';
import { apiConfig } from '../config';

export default class SocketManage {
    token: string;
    socket?: Socket;
    constructor(token: string) {
        this.token = token;
        if (!token) return;
        this.socket = io(apiConfig.baseUrl.replace('/api/v1', ''), {
            extraHeaders: {
                authorization: `bearer ${token}`,
            },
        });
    }
}
