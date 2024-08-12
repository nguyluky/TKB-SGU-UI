import { createContext, Dispatch, SetStateAction } from 'react';
import { Client } from '../../Service';

export interface UserInfoType {
    id: string;
    display_name: string;
    mssv: string;
    khoa: string;
    lop: string;
    avt: string;
}

export interface GlobalContent {
    theme: 'dark' | 'light' | 'auto' | string;
    client: Client;
    userInfo?: UserInfoType;
}

const initValue: GlobalContent = {
    theme: localStorage.getItem('theme') || 'light',
    client: Client.LoadFromLocal(),
};

const globalContent = createContext<[GlobalContent, Dispatch<SetStateAction<GlobalContent>>]>(
    null!,
);

export { initValue };
export default globalContent;
