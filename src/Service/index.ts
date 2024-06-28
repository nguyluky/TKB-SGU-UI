import axios, { AxiosInstance } from 'axios';
import api from '../config/api';

const ApiEndPoint = api.baseUrl + '/api/v1';

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


var ClientInstance: Client;
export class Client {
    public request: AxiosInstance;
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
