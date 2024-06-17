import { useContext, useState } from 'react';
import Popup from 'reactjs-popup';
import PopupModel from '../../components/PopupModel';
import { cx } from './DsTkb';
import { globalContent } from '../../store/GlobalContent';
import { useNavigate } from 'react-router-dom';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';

export interface CreateTkbResp {
    code: number;
    msg: string;
    success: boolean;
    data?: Data;
}

export interface Data {
    id: string;
    name: string;
    tkb_describe: string;
    thumbnail: null;
    ma_hoc_phans: any[];
    id_to_hocs: any[];
    rule: number;
    created: string;
}

export function NewTkb() {
    const [globalState, setGlobalState] = useContext(globalContent);
    const [isShow, setShow] = useState(false);
    const [name, setName] = useState('untitled');

    const nav = useNavigate();

    const sendCreateTkbReq = () => {
        // send create tkb resp
        globalState.client.request
            .post<CreateTkbResp>('/tkbs', {
                name: name,
                thumbnail: null,
                public: false,
            })
            .then((resp) => {
                if (!resp.data.success || !resp.data.data) {
                    notifyMaster.error(resp.data.msg);
                    return;
                }
                nav(resp.data.data.id);
            });
    };

    return (
        <div className={cx('card', 'new')} onClick={() => setShow(true)}>
            <div className={cx('thumbnail')}>
                <div className={cx('icon-wrapper')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
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
                        <select name="pos" id="pos">
                            <option value="client">client</option>
                            <option value="server">server</option>
                        </select>
                    </div>
                </PopupModel>
            </Popup>
        </div>
    );
}