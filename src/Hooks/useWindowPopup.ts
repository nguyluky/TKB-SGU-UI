import { useCallback, useEffect, useRef } from 'react';

export interface GoogleRespType {
    notify: { notifyType: 'error' | 'success' | 'info' | 'warning'; mess: string };
    googleOauth2: string;
}

export interface windowPopupMessageRep<T extends keyof GoogleRespType> {
    type: T;
    name: string;
    data: GoogleRespType[T];
}

function popupCenter({ url, title, w, h }: { url: string; title: string; w: number; h: number }) {
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : // eslint-disable-next-line no-restricted-globals
          screen.width;
    const height = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : // eslint-disable-next-line no-restricted-globals
          screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;
    const newWindow = window.open(
        url,
        title,
        `scrollbars=yes,width=${w / systemZoom},height=${h / systemZoom},top=${top},left=${left}`,
    );

    if (newWindow) newWindow.focus();
    return newWindow;
}

export default function useWindowPopup(
    eventListener?: (
        event: MessageEvent<
            windowPopupMessageRep<'notify'> | windowPopupMessageRep<'googleOauth2'>
        >,
    ) => void,
) {
    const windownRef = useRef<Window | null>();
    const name = useRef<string>('');

    useEffect(() => {
        function t(
            event: MessageEvent<
                windowPopupMessageRep<'notify'> | windowPopupMessageRep<'googleOauth2'>
            >,
        ) {
            if (event.data.name === name.current) {
                eventListener && eventListener(event);
            }
        }

        eventListener && window.addEventListener('message', t);

        return () => {
            eventListener && window.removeEventListener('message', t);
        };
    }, [eventListener]);

    const open = useCallback((arg: { url: string; title: string; w: number; h: number }) => {
        if (windownRef.current) {
            windownRef.current.close();
            windownRef.current = null;
        }

        name.current = arg.title;
        windownRef.current = popupCenter(arg);
    }, []);

    const close = useCallback(() => {
        try {
            windownRef.current && windownRef.current.close();
        }
        catch (e) {
            console.error(e);
        }
    }, []);

    return {
        open,
        close,
    };
}
