import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';

import { TkbData } from '../../Service';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import PopupModel from '../../components/PopupModel';
import { globalContent } from '../../store/GlobalContent';
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
    const [name, setName] = useState('untitled');
    const [pos, setPos] = useState('client');

    const nav = useNavigate();

    const sendCreateTkbReq = () => {
        // send create tkb resp

        console.log(pos);

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

            <Popup open={isShow} onClose={() => setShow(false)}>
                <PopupModel title="Tạo mới" onCancel={() => setShow(false)} onOk={sendCreateTkbReq}>
                    <div className={cx('input')}>
                        <label form="inputname">Name</label>
                        <input
                            type="text"
                            name="inputname"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>

                    <div className={cx('input')}>
                        <label>Vị trí lưu</label>
                        <select
                            name="pos"
                            id="pos"
                            value={pos}
                            onChange={(e) => setPos(e.target.value)}
                        >
                            <option value="client">Client</option>
                            <option value="server">Server</option>
                        </select>
                    </div>
                </PopupModel>
            </Popup>
        </div>
    );
}
