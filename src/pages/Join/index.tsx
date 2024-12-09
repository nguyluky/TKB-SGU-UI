import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import { globalContent } from '../../store/GlobalContent';

export default function Join() {
    const nav = useNavigate();
    const { joinId } = useParams();
    const [globalState] = useContext(globalContent);

    useEffect(() => {
        if (!globalState.client.islogin()) {
            notifyMaster.error('Bạn phải đăng nhập mới được tham gia tkb');
            nav('/tkbs');
            return;
        } else {
            globalState.client.serverApi.join(joinId || '').then((e) => {
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

    return <p></p>;
}
