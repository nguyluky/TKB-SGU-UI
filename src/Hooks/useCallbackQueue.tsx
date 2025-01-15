import { useCallback, useContext } from 'react';
import { callbackContent } from '../store/CallbackContent';

export default function useCallbackQueue(): [
    (id_: string, c: () => void) => void,
    (id_: string) => void,
    (id_: string) => void
] {
    const [callbackState, setCallbackState] = useContext(callbackContent);

    const add = useCallback(
        (id_: string, c: () => void) => {
            console.log('add', id_);
            setCallbackState((prev) => {
                return { ...prev, [id_]: c };
            });
        },
        [setCallbackState]
    );
    const call = useCallback(
        (id_: string) => {
            console.log('call', id_);
            callbackState[id_]?.();
        },
        [callbackState]
    );

    const deleteCallback = useCallback(
        (id_: string) => {
            console.log('delete', id_);
            setCallbackState((prev) => {
                delete prev[id_];
                return { ...prev };
            });
        },
        [setCallbackState]
    );

    return [add, call, deleteCallback];
}
