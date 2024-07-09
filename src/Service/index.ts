import axios, { AxiosInstance } from 'axios';
import api from '../config/api';
import { apiConfig } from '../config';


const ApiEndPoint = api.baseUrl ;

export interface TkbData {
    id: string;
    name: string;
    tkb_describe: string;
    thumbnails: null;
    ma_hoc_phans: string[];
    id_to_hocs: string[];
    rule: number;
    isClient?: boolean;
    created: Date; //"2024-06-17T12:22:36.000Z"
}


export interface DsNhomHocResp {
    ds_nhom_to: DsNhomTo[];
    ds_mon_hoc: { [key: string]: string };
}

export interface DsNhomTo {
    id_to_hoc: string;
    id_mon: string;
    ma_mon: string;
    ten_mon: string;
    so_tc: number;
    lop: Lop;
    ds_lop: Lop[];
    ds_khoa: Lop[];
    tkb: TkbTiet[];
}

export interface Lop {
    ma: string;
    ten: string;
}

export interface TkbTiet {
    thu: string;
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
    request: AxiosInstance;
    getDsTkb(): Promise<ApiResponse<TkbData[]>>;
    getTkb(tkbId: string): Promise<ApiResponse<TkbData>>;
    createNewTkb(
        name: string,
        tkb_describe: string,
        thumbnail: any,
        public_: boolean,
    ): Promise<ApiResponse<any>>;
    updateTkb(tkbData: TkbData): Promise<ApiResponse<null>>;
    deleteTkb(tkbId: string): Promise<ApiResponse<null>>;

    getDsNhomHoc() : Promise<DsNhomHocResp>;

    createInviteLink(tkbId: string): Promise<ApiResponse<string>>;
    join(inviteLink: string): Promise<ApiResponse<null>>;
    getDsMember(tkbId: string): Promise<ApiResponse<Member[]>>;
    updateRuleMember(tkbId: string, memberId: string, rule: number): Promise<ApiResponse<null>>;
    removeMember(tkbId: string, memberId: string): Promise<ApiResponse<null>>;
}

class ServerApi implements BaseApi {
    request: AxiosInstance;
    constructor(request: AxiosInstance) {
        this.request = request
    }

    async getDsTkb(): Promise<ApiResponse<TkbData[]>> {
        var resp = await this.request.get<ApiResponse<TkbData[]>>(apiConfig.getDsTkb());
        return resp.data;
    }

    async getTkb(tkbId: string): Promise<ApiResponse<TkbData>> {
        var resp = await this.request.get<ApiResponse<TkbData>>(apiConfig.getTkb(tkbId));
        return resp.data;
    }

    async createNewTkb(name: string, tkb_describe: string, thumbnail: any, public_: boolean): Promise<ApiResponse<any>> {
        var resp = await this.request.post<ApiResponse<any>>(apiConfig.createTkb(), {
            name: name,
            tkb_describe: tkb_describe,
            thumbnail: null,
            public: false,
        })

        return resp.data;
    }

    async updateTkb(tkbData: TkbData): Promise<ApiResponse<null>> {
        var resp = await this.request.put<ApiResponse<null>>(apiConfig.updateTkb(tkbData.id), tkbData);
        return resp.data;
    }   

    async deleteTkb(tkbId: string): Promise<ApiResponse<null>> {
        var resp = await this.request.delete<ApiResponse<null>>(api.deleteTkb(tkbId));
        return resp.data;
    }

    async createInviteLink(tkbId: string): Promise<ApiResponse<string>> {
        var resp = await this.request.post<ApiResponse<string>>(apiConfig.createJoinLink(tkbId));

        return resp.data;
    }

    async join(inviteLink: string): Promise<ApiResponse<null>> {
        var resp = await this.request.post<ApiResponse<null>>(apiConfig.joinTkb(inviteLink));
        return resp.data;
    }

    async getDsMember(tkbId: string): Promise<ApiResponse<Member[]>> {
        var resp = await this.request.get<ApiResponse<Member[]>>(apiConfig.getDsMember(tkbId));

        return resp.data;
    }

    async updateRuleMember(tkbId: string, memberId: string, rule: number): Promise<ApiResponse<null>> {
        var resp = await this.request.put<ApiResponse<null>>(apiConfig.updateRuleMember(tkbId, memberId), {rule: rule});
        return resp.data;
    }

    async removeMember(tkbId: string, memberId: string): Promise<ApiResponse<null>> {
        var resp = await this.request.delete<ApiResponse<null>>(apiConfig.removeMember(tkbId, memberId));
        return resp.data;
    }

    async getDsNhomHoc(): Promise<DsNhomHocResp> {
        var getData = this.request.get<DsNhomHocResp>(apiConfig.getDsNhomHoc());
        

        return (await getData).data;
    }

}


// class localApi implements Omit<BaseApi,'createInviteLink'|'join'|'getDsMember'|'updateRuleMember'|'removeMember'> {
    
// }


var ClientInstance: Client;
export class Client {
    public request: AxiosInstance;
    public serverApi: ServerApi;
    private token?: string;

    constructor(token?: string) {
        this.token = token;
        ClientInstance = this;
        this.request = axios.create({
            baseURL: ApiEndPoint,
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        this.serverApi = new ServerApi(this.request);
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
