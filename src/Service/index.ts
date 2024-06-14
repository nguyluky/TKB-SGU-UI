import axios, { AxiosInstance } from 'axios';
import { generateUUID } from '../utils';
import api from '../config/api';

const ApiEndPoint = api.baseUrl + '/api/v1';

interface RespApiBase {
    code: number;
    msg: string;
    success: boolean;
    data: object | Array<any> | any;
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
