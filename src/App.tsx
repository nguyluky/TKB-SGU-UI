import { useContext, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import 'reactjs-popup/dist/index.css';

import notifyMaster from './components/NotifyPopup/NotificationManager';
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

    useEffect(() => {
        notifyMaster.warning(
            'Hiện mình chưa có cập nhật hết toàn bộ các môn học nếu mà các bạn gặp thứ 0 tiết 0-0 thì đó là nhữa cái chưa được cập nhật. Mong mọi người thông cảm!',
            'Thông báo quan trọng',
            0,
        );
    }, []);

    return <RouterProvider router={routers} />;
}

export default App;
