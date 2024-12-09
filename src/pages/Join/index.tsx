import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import { globalContent } from '../../store/GlobalContent';
import Loader from '../components/Loader';
import Error from '../Error';

export default function Join() {
    const nav = useNavigate();
    const { joinId } = useParams();
    const [globalState] = useContext(globalContent);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!globalState.client.islogin()) {
            notifyMaster.error('Bạn phải đăng nhập mới được tham gia tkb');
            nav('/tkbs');
            return;
        } else {
            globalState.client.serverApi.join(joinId || '').then((e) => {
                setIsLoading(false);

                if (!e.success) {
                    notifyMaster.error(e.msg);
                    return;
                }

                if (e.data) nav('/tkbs/' + e.data);
                else nav('./tkbs');
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [joinId]);

    console.log(joinId);

    return (
        <Loader isLoading={isLoading}>
            <Error code={304} msg="bad req"></Error>
        </Loader>
    );
}
