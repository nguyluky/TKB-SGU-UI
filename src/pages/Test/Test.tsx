import { useContext, useEffect } from 'react';
import { globalContent } from '../../store/GlobalContent';

function Test() {
    const [globalState, setGlobalState] = useContext(globalContent);
    useEffect(() => {
        // globalState.client.localApi.getDsTkb().then((e) => {
        //     console.log(e);
        // });
        globalState.client.localApi.createNewTkb('local test', '', null, false).then((e) => {
            console.log(e);
        });
        // globalState.client.localApi.getTkb('fbdac617-9e3d-4074-95c8-769a9027cab8').then((e) => {
        //     console.log(e);
        // });
        // globalState.client.localApi.updateTkb()
    }, []);

    return <div>test</div>;
}

export default Test;
