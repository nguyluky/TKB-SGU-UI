import { useContext, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import 'reactjs-popup/dist/index.css';

import routers from './routes';
import { Client } from './Service';
import { globalContent } from './store/GlobalContent';

function App() {
    const [globalState, setGlobalState] = useContext(globalContent);

    useEffect(() => {
        window.document
            ?.querySelector('html')
            ?.setAttribute('theme', globalState?.theme || 'light');
    }, [globalState?.theme]);

    useEffect(() => {
        globalState.client.getUserInfo().then((res) => {
            // nếu token hết hạn thì tự động log out
            if (!res.success) {
                setGlobalState((e) => {
                    e.userInfo = undefined;
                    e.client = new Client('');
                    return { ...e };
                });
            } else setGlobalState({ ...globalState, userInfo: res.data });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalState.client.islogin, setGlobalState]);

    return <RouterProvider router={routers} />;
}

export default App;
