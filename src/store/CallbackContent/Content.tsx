import { createContext, Dispatch, SetStateAction } from 'react';

type CallbackContent = { [key: string]: () => any };
const initValue: CallbackContent = {};

const callbackContent = createContext<[CallbackContent, Dispatch<SetStateAction<CallbackContent>>]>(null!);

export { initValue };
export default callbackContent;
