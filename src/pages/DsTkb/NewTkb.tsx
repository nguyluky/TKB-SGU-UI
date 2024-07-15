import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TkbData } from '../../Service';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import { globalContent } from '../../store/GlobalContent';
import { CreateNewTkb } from '../components/PagesPopup';
import { cx } from './DsTkb';

export interface CreateTkbResp {
    code: number;
    msg: string;
    success: boolean;
    data?: TkbData;
}

export function NewTkb() {
    const [globalState] = useContext(globalContent);

    const [isShow, setShow] = useState(false);

    const nav = useNavigate();

    const sendCreateTkbReq = (name: string, pos: string) => {
        // send create tkb resp
        if (pos === 'server')
            globalState.client.serverApi.createNewTkb(name, '', null, false).then((data) => {
                if (!data.success || !data.data) {
                    notifyMaster.error(data.msg);
                    return;
                }
                nav(data.data.id);
            });

        if (pos === 'client') {
            globalState.client.localApi.createNewTkb(name, '', null, false).then((data) => {
                if (!data.success || !data.data) {
                    notifyMaster.error(data.msg);
                    return;
                }
                nav(data.data.id + '?isclient=true');
            });
        }
    };

    return (
        <div className={cx('card', 'new')} onClick={() => setShow(true)}>
            <div className={cx('thumbnail')}>
                <div className={cx('icon-wrapper')}></div>
            </div>
            <div className={cx('info')}>
                <p className={cx('name')}>Tạo mới</p>
            </div>

            <CreateNewTkb
                open={isShow}
                onClose={() => {
                    setShow(false);
                }}
                onCreate={sendCreateTkbReq}
            />
        </div>
    );
}
