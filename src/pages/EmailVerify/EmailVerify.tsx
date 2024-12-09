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
                localStorage.setItem('token', resp.data.accessToken);

                globalState.client.getUserInfo().then((res) => {
                    // nếu token hết hạn thì tự động log out
                    if (!res.success) {
                        setGlobalState((e) => {
                            e.userInfo = undefined;
                            e.client = new Client('');
                            return { ...e };
                        });
                    } else {
                        setGlobalState((e) => {
                            e.userInfo = res.data;
                            e.client = new Client(resp.data?.accessToken);
                            return { ...e };
                        });
                    }
                });

                nav('/tkbs');
                notifyMaster.success('Xác thực email thành công');
                return;
            }

            setIsLoading(false);
        });
    }, [token]);

    return (
        <Loader isLoading={isLoading}>
            <Error code={404} msg="Xác thực không hợp lệ" icon="emailTimeOut"></Error>
        </Loader>
    );
}
