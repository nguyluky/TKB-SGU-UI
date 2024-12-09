import axios, { AxiosInstance } from 'axios';
import api from '../config/api';
import { apiConfig } from '../config';
import {
    addRecord,
    deleteRecord,
    getAllRecord,
    getRecord,
    TkbInfoIndexDb,
    updateRecord,
} from './localDB';
import { generateUUID } from '../utils';
import { UserInfoType } from '../store/GlobalContent/Content';
import { io, Socket } from 'socket.io-client';

const ApiEndPoint = api.baseUrl;

export interface TkbInfo {
    id: string;
    name: string;
    nam: string;
    tkb_describe: string;
    thumbnails: null | Blob;
    isClient?: boolean;
    created: Date; //"2024-06-17T12:22:36.000Z"
}

export type TkbContent = string[];

export type TkbContentMmh = string[];

export interface DsNhomHocResp {
    ds_nhom_to: NhomHoc[];
    ds_mon_hoc: { [key: string]: string };
}

export interface DsNhomHocRespData {
    ds_nhom_to: NhomHoc[];
    ds_mon_hoc: { id: string; display_name: string }[];
}

export interface NhomHoc {
    id_to_hoc: string;
    id_mon: string;
    ma_mon: string;
    ten_mon: string;
    so_tc: number;
    lop: Lop;
    ds_lop: Lop[];
    ds_khoa: Lop[];
    tkb: TkbTiet[];
    nhom: string;
}

export interface Lop {
    ma: string;
    ten: string;
}

export interface TkbTiet {
    thu: number;
    tbd: number;
    tkt: number;
    phong: string;
    gv: null | string;
    th: boolean;
}

interface Member {
    user_id: string;
    display_name: string;
    rule: number;
}

export interface ApiResponse<T> {
    code: number;
    msg: string;
    success: boolean;
    data?: T;
}

interface BaseApi {
    // /
    createNewTkb({ ...arg }: Omit<TkbInfo, 'id' | 'created'>): Promise<ApiResponse<TkbInfo>>;
    getDsTkb(): Promise<ApiResponse<TkbInfo[]>>;

    // /:tkbId
    deleteTkb(tkbId: string): Promise<ApiResponse<null>>;
    getTkb(tkbId: string): Promise<ApiResponse<TkbInfo>>;
    updateTkbInfo(tkbData: TkbInfo): Promise<ApiResponse<null>>;

    // /:tkbId/id_to_hoc
    getTkbContent(tkbId: string): Promise<ApiResponse<TkbContent>>;
    updateTkbContent(tkbId: string, idToHocs: string[]): Promise<ApiResponse<string[]>>;

    // /:tkbId/ma_mom_hoc
    getTkbContentMmh(tkbId: string): Promise<ApiResponse<TkbContentMmh>>;
    updateTkbContentMmh(tkbId: string, Mmh: string[]): Promise<ApiResponse<string[]>>;

    // /:tkbId/invite
    createInviteLink(tkbId: string): Promise<ApiResponse<string>>;
    // /join
    join(inviteLink: string): Promise<ApiResponse<string>>;

    // /:tkbId/member
    getDsMember(tkbId: string): Promise<ApiResponse<Member[]>>;
    // /:tkbId/member/:userId
    updateRuleMember(tkbId: string, memberId: string, rule: number): Promise<ApiResponse<null>>;
    removeMember(tkbId: string, memberId: string): Promise<ApiResponse<null>>;

    //
    getDsNhomHoc(): Promise<DsNhomHocRespData>;
}

class ServerApi implements BaseApi {
    request: AxiosInstance;
    constructor(request: AxiosInstance) {
        this.request = request;
    }

    async getDsTkb(): Promise<ApiResponse<TkbInfo[]>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                    data: [],
                });
            });
        }
        const resp = await this.request.get<ApiResponse<TkbInfo[]>>(apiConfig.getDsTkb());
        if (resp.data.data)
            resp.data.data.forEach((e) => {
                e.created = new Date(e.created);
            });
        return resp.data;
    }

    async getTkb(tkbId: string): Promise<ApiResponse<TkbInfo>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }
        const resp = await this.request.get<ApiResponse<TkbInfo>>(apiConfig.getTkb(tkbId));
        if (resp.data.data) {
            resp.data.data.created = new Date(resp.data.data.created);
        }
        return resp.data;
    }

    async createNewTkb(tkb: Omit<TkbInfo, 'id' | 'created'>): Promise<ApiResponse<TkbInfo>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }
        const resp = await this.request.post<ApiResponse<TkbInfo>>(apiConfig.createTkb(), {
            name: tkb.name,
            tkb_describe: tkb.tkb_describe,
            thumbnail: tkb.thumbnails,
            public: false,
        });

        if (resp.data.data) resp.data.data.created = new Date(resp.data.data.created);

        return resp.data;
    }

    async updateTkbInfo(tkbData: TkbInfo): Promise<ApiResponse<null>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }
        const resp = await this.request.put<ApiResponse<null>>(
            apiConfig.updateTkbInfo(tkbData.id),
            tkbData,
        );
        return resp.data;
    }

    async deleteTkb(tkbId: string): Promise<ApiResponse<null>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }
        const resp = await this.request.delete<ApiResponse<null>>(api.deleteTkb(tkbId));
        return resp.data;
    }

    async createInviteLink(tkbId: string): Promise<ApiResponse<string>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }
        const resp = await this.request.post<ApiResponse<string>>(apiConfig.createJoinLink(tkbId));

        return resp.data;
    }

    async join(inviteLink: string): Promise<ApiResponse<string>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }
        const resp = await this.request.post<ApiResponse<string>>(apiConfig.joinTkb(inviteLink));
        return resp.data;
    }

    async getDsMember(tkbId: string): Promise<ApiResponse<Member[]>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }
        const resp = await this.request.get<ApiResponse<Member[]>>(apiConfig.getDsMember(tkbId));

        return resp.data;
    }

    async updateRuleMember(
        tkbId: string,
        memberId: string,
        rule: number,
    ): Promise<ApiResponse<null>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }
        const resp = await this.request.put<ApiResponse<null>>(
            apiConfig.updateRuleMember(tkbId, memberId) + '?rule=' + encodeURIComponent(rule),
        );
        return resp.data;
    }

    async removeMember(tkbId: string, memberId: string): Promise<ApiResponse<null>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }
        const resp = await this.request.delete<ApiResponse<null>>(
            apiConfig.removeMember(tkbId, memberId),
        );
        return resp.data;
    }

    async getDsNhomHoc(): Promise<DsNhomHocRespData> {
        if (!window.navigator.onLine) {
            return JSON.parse(localStorage.getItem('dsNhomHoc') || '{}');
        }

        const getData = this.request.get<DsNhomHocRespData>(apiConfig.getDsNhomHoc());
        const data = (await getData).data;
        return data;
    }

    async updateTkbContent(tkbId: string, idToHocs: string[]): Promise<ApiResponse<string[]>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }

        const resp = await this.request.put<ApiResponse<string[]>>(
            apiConfig.updateTkbContent(tkbId),
            idToHocs,
        );

        return resp.data;
    }

    async updateTkbContentMmh(tkbId: string, Mmh: string[]): Promise<ApiResponse<string[]>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }

        const resp = await this.request.put<ApiResponse<string[]>>(
            apiConfig.updateTkbContentMmh(tkbId),
            Mmh,
        );

        return resp.data;
    }

    async getTkbContent(tkbId: string): Promise<ApiResponse<TkbContent>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }

        const resp = await this.request.get<ApiResponse<TkbContent>>(
            apiConfig.getTkbContent(tkbId),
        );
        return resp.data;
    }

    async getTkbContentMmh(tkbId: string): Promise<ApiResponse<TkbContentMmh>> {
        if (!window.navigator.onLine) {
            return new Promise((r, a) => {
                r({
                    code: 500,
                    msg: 'Không có kết nối mạng',
                    success: false,
                });
            });
        }

        const resp = await this.request.get<ApiResponse<TkbContentMmh>>(
            apiConfig.getTkbContentMmh(tkbId),
        );
        return resp.data;
    }

    async getUserInfoAsQuest(userId: string) {
        const resp = await this.request.get<ApiResponse<UserInfoType>>(api.getUserInfoAsQuest(userId));
        return resp.data;
    }

    async emailVerify(token: string) {
        const resp = await this.request.get<ApiResponse<{
            accessToken: string;
            token_type: string;
        }>>(api.emailVerify(token));
        
        return resp.data;
    }

}

class localApi
    implements
        Omit<
            BaseApi,
            | 'createInviteLink'
            | 'join'
            | 'getDsMember'
            | 'updateRuleMember'
            | 'removeMember'
            | 'getDsNhomHoc'
        >
{
    async getDsTkb(): Promise<ApiResponse<TkbInfo[]>> {
        const ev = await getAllRecord();

        return {
            code: 200,
            msg: '',
            success: true,
            data: ev,
        };
    }

    async getTkb(tkbId: string): Promise<ApiResponse<TkbInfo>> {
        const ev = await getRecord(tkbId);

        return {
            code: 200,
            msg: '',
            success: true,
            data: ev,
        };
    }

    async updateTkbInfo(tkbData: TkbInfo): Promise<ApiResponse<null>> {
        const a = await getRecord(tkbData.id);

        await updateRecord({
            id: tkbData.id,
            name: tkbData.name,
            nam: tkbData.nam,
            tkb_describe: tkbData.tkb_describe,
            thumbnails: tkbData.thumbnails,
            ma_hoc_phans: a.ma_hoc_phans,
            id_to_hocs: a.id_to_hocs,
            rule: a.rule,
            isClient: a.isClient,
            created: a.created,
        });

        return {
            code: 200,
            msg: '',
            success: true,
        };
    }

    async deleteTkb(tkbId: string): Promise<ApiResponse<null>> {
        await deleteRecord(tkbId);

        return {
            code: 200,
            msg: '',
            success: true,
        };
    }

    async createNewTkb(tkbInfo: Omit<TkbInfo, 'id' | 'created'>): Promise<ApiResponse<TkbInfo>> {
        const newTkb: TkbInfoIndexDb = {
            id: generateUUID(),
            name: tkbInfo.name,
            nam: tkbInfo.nam,
            tkb_describe: tkbInfo.tkb_describe,
            thumbnails: tkbInfo.thumbnails,
            id_to_hocs: [],
            ma_hoc_phans: [],
            rule: 0,
            isClient: true,
            created: new Date(),
        };

        await addRecord(newTkb);

        return {
            code: 200,
            msg: '',
            success: true,
            data: newTkb,
        };
    }

    async getTkbContent(tkbId: string): Promise<ApiResponse<TkbContent>> {
        const a = await getRecord(tkbId);
        return {
            code: 200,
            success: true,
            msg: '',
            data: a.id_to_hocs,
        };
    }

    async getTkbContentMmh(tkbId: string): Promise<ApiResponse<TkbContentMmh>> {
        const a = await getRecord(tkbId);
        return {
            code: 200,
            success: true,
            msg: '',
            data: a.ma_hoc_phans,
        };
    }

    async updateTkbContent(tkbId: string, idToHocs: string[]): Promise<ApiResponse<string[]>> {
        const old = await getRecord(tkbId);
        old.id_to_hocs = idToHocs;
        await updateRecord(old);
        return {
            code: 200,
            success: true,
            msg: '',
            data: idToHocs,
        };
    }

    async updateTkbContentMmh(tkbId: string, Mmh: string[]): Promise<ApiResponse<string[]>> {
        const old = await getRecord(tkbId);
        old.ma_hoc_phans = Mmh;
        await updateRecord(old);
        return {
            code: 200,
            success: true,
            msg: '',
            data: Mmh,
        };
    }
}


export interface ServerToClientEvents {
    join:             (userId: string) => void;
    leave:            (userId: string) => void;
    updateTkbInfo:    (tkbInfo: TkbInfo) => void;
    updateMaHocPhans: (tkbId: string, maHocPhans: string[]) => void;
    updateIdToHocs:   (tkbId: string, idToHocs: string[]) => void;
    exception:        (data: {code: number, msg: string, success: boolean, data: any}) => void;
    usersJoined:       (userId: string[]) => void;
}

export interface ClientToServerEvents {
    onJoin:           (tkbId: string) => void;
    onLeave:          (tkbId: string) => void;
    onUpdateTkbInfo:  (tkbInfo: TkbInfo) => void;
    onUpdateMaHocPhans: (tkbId: string, maHocPhans: string[]) => void;
    onUpdateIdToHocs: (tkbId: string, idToHocs: string[]) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    userId: string;
}

let ClientInstance: Client;
export class Client {
    public request: AxiosInstance;
    public serverApi: ServerApi;
    public localApi: localApi;
    public token?: string;
    public socket: Socket<ServerToClientEvents, ClientToServerEvents>;

    constructor(token?: string) {
        this.token = token;
        ClientInstance = this;
        this.localApi = new localApi();
        this.request = axios.create({
            baseURL: ApiEndPoint,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        this.serverApi = new ServerApi(this.request);
        this.socket = io(apiConfig.baseUrl.replace('/api/v2', ''), {
            extraHeaders: {
                authorization: `bearer ${token}`,
            },
        });
    }

    async getUserInfo() {
        const res = await this.request.get<ApiResponse<UserInfoType>>(api.getUserInfo());
        return res.data;
    }

    islogin() {
        return !!this.token;
    }

    // =======================================================================
    //                              STATIC FUNCTION
    // =======================================================================

    static LoadFromLocal() {
        return new Client(localStorage.getItem('token') || undefined);
    }

    static getInstance() {
        return ClientInstance;
    }
}
