import { io, Socket } from 'socket.io-client';
import { apiConfig } from '../config';

interface SocketEventListener {
    onJoin: (args: [tkbId: string, userId: string]) => void;
    onLeave: (args: [tkbId: string, userId: string]) => void;
    onSelestion: (args: [tkbId: string, idToHocs: string][]) => void;
    onAddHocPhan: (args: [tkbId: string, mxhp: string, isTimeLine: boolean]) => void;
    onAddNhomHoc: (args: [tkbId: string, idToHoc: string, isTimeLine: boolean, replay: boolean]) => void;
    onRemoveHocPhan: (args: [tkbId: string, mxhp: string, isTimeLine: boolean]) => void;
    onRemoveNhomHoc: (args: [tkbId: string, idToHoc: string, isTimeLine: boolean]) => void;
}

interface SocketEventEmit {
    join: [tkbId: string];
    leave: [tkbId: string];
    selestion: [tkbId: string, idToHocs: string[]];
    addHocPhan: [tkbId: string, mxhp: string, isTimeLine: boolean];
    addNhomHoc: [tkbId: string, idToHoc: string, isTimeLine: boolean, replay: boolean];
    removeHocPhan: [tkbId: string, mxhp: string, isTimeLine: boolean];
    removeNhomHoc: [tkbId: string, idToHoc: string, isTimeLine: boolean];
}

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

    addEventListener<Key extends keyof SocketEventListener>(name: Key, callback: SocketEventListener[Key]) {
        if (!this.socket) return;
        this.socket.on<keyof SocketEventListener>(name, callback);
    }

    removeEventListener<Key extends keyof SocketEventListener>(name: Key) {
        if (!this.socket) return;
        this.socket.off(name);
    }

    emit<Key extends keyof SocketEventEmit>(name: Key, ...arg: SocketEventEmit[Key]) {
        if (!this.socket) return;

        this.socket.emit(name, ...arg);
    }
}
