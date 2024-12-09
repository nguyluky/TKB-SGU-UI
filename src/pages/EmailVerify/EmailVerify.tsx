import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import { Client } from '../../Service';
import { globalContent } from '../../store/GlobalContent';
import Loader from '../components/Loader';
import Error from '../Error';

export default function EmailVerify() {
    const nav = useNavigate();
    const { token } = useParams();

    const [globalState, setGlobalState] = useContext(globalContent);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log(token);
        globalState.client.serverApi.emailVerify(token || '').then((resp) => {
            console.log(resp);
            if (resp.data) {
                window.localStorage.setItem('token', resp.data.accessToken);
                const client = new Client(resp.data.accessToken);

                client.getUserInfo().then((resp) => {
                    if (resp.success) globalState.userInfo = resp.data;

                    globalState.client = client;
                    setGlobalState({ ...globalState });
                });
                nav('/tkbs');
                notifyMaster.success('Xác thực email thành công');
                return;
            }

            setIsLoading(false);
        });
    }, [globalState, setGlobalState, token]);

    return (
        <Loader isLoading={isLoading}>
            <Error code={404} msg="Xác thực không hợp lệ" icon="emailTimeOut"></Error>
        </Loader>
    );
}
