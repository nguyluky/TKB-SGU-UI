import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';

import { TkbData } from '../../Service';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import PopupModel from '../../components/PopupModel';
import { globalContent } from '../../store/GlobalContent';
import { generateUUID } from '../../utils';
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
            var newTkb: TkbData = {
                id: generateUUID(),
                name: name,
                tkb_describe: '',
                thumbnails: null,
                id_to_hocs: [],
                ma_hoc_phans: [],
                rule: 0,
                isClient: true,
                created: new Date(),
            };

            var preDsTkb: TkbData[] = JSON.parse(localStorage.getItem('sdTkb') || '[]');

            preDsTkb.push(newTkb);

            localStorage.setItem('sdTkb', JSON.stringify(preDsTkb));

            nav(newTkb.id + '?isclient=true');
        }
    };

    return (
        <div className={cx('card', 'new')} onClick={() => setShow(true)}>
            <div className={cx('thumbnail')}>
                <div className={cx('icon-wrapper')}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
                            <stop offset="0%" stopColor="#D16BA5" />
                            <stop offset="50%" stopColor="#86A8E7" />
                            <stop offset="100%" stopColor="#5FFBF1" />
                        </linearGradient>
                        <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" fill="url(#grad1)"></path>
                    </svg>
                </div>
            </div>
            <div className={cx('info')}>
                <p className={cx('name')}>Tạo mới</p>
            </div>

            <Popup open={isShow} onClose={() => setShow(false)}>
                <PopupModel title="Tại mới" onCancel={() => setShow(false)} onOk={sendCreateTkbReq}>
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
                            <option value="client">client</option>
                            <option value="server">server</option>
                        </select>
                    </div>
                </PopupModel>
            </Popup>
        </div>
    );
}
