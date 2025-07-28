import { useContext, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
// import 'reactjs-popup/dist/index.css';
import './components/Popup/index.css';

import routers from './routes';
import { Client } from './Service';
import { globalContent } from './store/GlobalContent';

function App() {
    const [globalState, setGlobalState] = useContext(globalContent);

    useEffect(() => {
        if (globalState.theme && globalState.theme === 'auto') {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const newColorScheme = darkModeMediaQuery.matches ? 'dark' : 'light';
            window.document?.querySelector('html')?.setAttribute('theme', newColorScheme);
        } else window.document?.querySelector('html')?.setAttribute('theme', globalState?.theme || 'light');
    }, [globalState?.theme]);

    useEffect(() => {
        globalState.client
            .getUserInfo()
            .then((res) => {
                // nếu token hết hạn thì tự động log out
                if (!res.success) {
                    localStorage.removeItem('token');
                    setGlobalState((e) => {
                        e.userInfo = undefined;
                        e.client = new Client('');
                        return { ...e };
                    });
                    return;
                }
                setGlobalState({ ...globalState, userInfo: res.data });
                localStorage.setItem('userInfo', JSON.stringify(res.data));
            })
            .catch(() => {
                setGlobalState((e) => {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        e.userInfo = undefined;
                    } else {
                        e.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                    }
                    return { ...e };
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalState.client.islogin, setGlobalState]);

    // useEffect(() => {
    //     notifyMaster.warning(
    //         'Vẫn trong quá trình cập nhât. Tham gia discord để nhận được thông báo mới nhất.',
    //         'Thông báo!!!',
    //         -1
    //     );
    // }, []);

    return <RouterProvider router={routers} />;
}

export default App;
