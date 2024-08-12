import { useContext, useEffect } from "react";
import { globalContent } from "../store/GlobalContent";


export default function useTkbSocket(
    onAddHphandler: (mhp: string, isTimeLine?: boolean | undefined, isSocket?: boolean | undefined) => void,
    onAddNhomHocHandler: (idToHoc: string, isTimeLine?: boolean | undefined, replay?: boolean | undefined, isSocket?: boolean | undefined) => void,
    onRemoveHphandeler: (mhp: string, isTimeLine?: boolean | undefined, isSocket?: boolean | undefined) => void,
    onRemoveNhomHocHandler: (idToHoc: string, isTimeLine?: boolean | undefined, isSocket?: boolean | undefined) => void
) {
    const [globalState] = useContext(globalContent);
    

    useEffect(() => {
        if (!globalState.client.islogin()) return;

        globalState.client.socket.addEventListener('onJoin', ([tkbId, userId]) => {});
        globalState.client.socket.addEventListener('onLeave', ([tkbId, userId]) => {});
        globalState.client.socket.addEventListener('onSelestion', ([tkbId, idToHocs]) => {});
        globalState.client.socket.addEventListener('onAddHocPhan', ([tkbId, mxhp, isTimeLine]) => {
            console.log(mxhp, isTimeLine);
            onAddHphandler(mxhp, isTimeLine, true);
        });
        globalState.client.socket.addEventListener('onAddNhomHoc', ([tkbId, idToHoc, isTimeLine, replay]) => {
            console.log(tkbId, idToHoc, isTimeLine, replay);
            onAddNhomHocHandler(idToHoc, isTimeLine, replay, true);
        });
        globalState.client.socket.addEventListener('onRemoveHocPhan', ([tkbId, mxhp, isTimeLine]) => {
            console.log(mxhp, isTimeLine);
            onRemoveHphandeler(mxhp, isTimeLine, true);
        });
        globalState.client.socket.addEventListener('onRemoveNhomHoc', ([tkbId, idToHoc, isTimeLine]) => {
            console.log(idToHoc, isTimeLine);
            onRemoveNhomHocHandler(idToHoc, isTimeLine, true);
        });

        return () => {
            globalState.client.socket.removeEventListener('onJoin');
            globalState.client.socket.removeEventListener('onLeave');
            globalState.client.socket.removeEventListener('onSelestion');
            globalState.client.socket.removeEventListener('onAddHocPhan');
            globalState.client.socket.removeEventListener('onAddNhomHoc');
            globalState.client.socket.removeEventListener('onRemoveHocPhan');
            globalState.client.socket.removeEventListener('onRemoveNhomHoc');
        };
    }, [globalState.client, onAddHphandler, onAddNhomHocHandler, onRemoveHphandeler, onRemoveNhomHocHandler]);

}