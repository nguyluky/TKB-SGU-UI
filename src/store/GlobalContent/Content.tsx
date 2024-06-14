import { Dispatch, SetStateAction, createContext } from 'react';
import { Client } from '../../Service';

export interface GlobalContent {
    theme: 'dark' | 'light' | 'auto' | string;
    client: Client;
}

const initValue: GlobalContent = {
    theme: localStorage.getItem('theme') || 'light',
    client: Client.LoadFromLocal(),
};

const globalContent = createContext<[GlobalContent, Dispatch<SetStateAction<GlobalContent>>]>(null!);

export { initValue };
export default globalContent;
