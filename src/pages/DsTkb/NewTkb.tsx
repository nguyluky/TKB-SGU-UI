import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import { TkbInfo } from '../../Service';
import { globalContent } from '../../store/GlobalContent';
import { CreateNewTkb } from '../components/PagesPopup';
import { cx } from './DsTkb';

export interface CreateTkbResp {
    code: number;
    msg: string;
    success: boolean;
    data?: TkbInfo;
}

export function NewTkb() {
    const [globalState] = useContext(globalContent);

    const [isShow, setShow] = useState(false);

    const nav = useNavigate();

    const sendCreateTkbReq = (name: string, pos: string, nam: string) => {
        // send create tkb resp
        if (pos === 'server')
            globalState.client.serverApi
                .createNewTkb({ name: name, tkb_describe: '', thumbnails: null, nam: nam })
                .then((data) => {
                    if (!data.success || !data.data) {
                        notifyMaster.error(data.msg);
                        return;
                    }
                    nav(data.data.id);
                });

        if (pos === 'client') {
            globalState.client.localApi
                .createNewTkb({ name: name, tkb_describe: '', thumbnails: null, nam: nam })
                .then((data) => {
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
                <svg height="0" width="0">
                    <defs>
                        <clipPath id="plus-path" clipPathUnits="objectBoundingBox">
                            <path d="M 0.570312 0.15625 C 0.570312 0.121094 0.539062 0.09375 0.5 0.09375 C 0.460938 0.09375 0.429688 0.121094 0.429688 0.15625 L 0.429688 0.4375 L 0.105469 0.4375 C 0.0664062 0.4375 0.0351562 0.464844 0.0351562 0.5 C 0.0351562 0.535156 0.0664062 0.5625 0.105469 0.5625 L 0.429688 0.5625 L 0.429688 0.84375 C 0.429688 0.878906 0.460938 0.90625 0.5 0.90625 C 0.539062 0.90625 0.570312 0.878906 0.570312 0.84375 L 0.570312 0.5625 L 0.894531 0.5625 C 0.933594 0.5625 0.964844 0.535156 0.964844 0.5 C 0.964844 0.464844 0.933594 0.4375 0.894531 0.4375 L 0.570312 0.4375 Z M 0.570312 0.15625 "></path>
                        </clipPath>
                    </defs>
                </svg>
                <div className={cx('icon-wrapper')}>
                    <div className={cx('plus-svg')}></div>
                </div>
                <div className={cx('icon-wrapper')}>
                    <div className={cx('plus-svg')}></div>
                </div>
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
