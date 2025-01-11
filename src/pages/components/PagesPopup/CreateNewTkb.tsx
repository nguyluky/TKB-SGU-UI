import classNames from 'classnames/bind';

import { useContext, useState } from 'react';
import Popup from 'reactjs-popup';
import { PopupProps } from 'reactjs-popup/dist/types';
import PopupModel from '../../../components/PopupModel';
import { globalContent } from '../../../store/GlobalContent';
import style from './PagesPopup.module.scss';

const cx = classNames.bind(style);

interface CreateNewTkbProps extends Omit<PopupProps, 'children'> {
    onCreate: (name: string, pos: string, nam: string) => void;
}

export default function CreateNewTkb({ onCreate, ...props }: CreateNewTkbProps) {
    const [globoalState] = useContext(globalContent);

    const [name, setName] = useState<string>('Thời khóa biểu');
    const [pos, setPos] = useState<string>('client');
    const [nam, setNam] = useState<string>('20242');

    return (
        <Popup {...props}>
            <PopupModel
                title="Tạo mới"
                onCancel={props.onClose}
                onOk={() => {
                    onCreate(name, pos, nam);
                }}
            >
                <div className={cx('input')}>
                    <label form="inputname">Name</label>
                    <input
                        type="text"
                        name="inputname"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>

                {/* <div className={cx('input')}>
                    <label>Vị trí lưu</label>
                    <select name="pos" id="pos" value={pos} onChange={(e) => setPos(e.target.value)}>
                        <option value="client">Client</option>
                        <option value="server" disabled={!!!globoalState.userInfo}>
                            Server
                        </option>
                    </select>
                </div> */}

                <div className={cx('input')}>
                    <label>Năm học</label>
                    <select name="nam" id="nam" value={nam} onChange={(e) => setNam(e.target.value)}>
                        <option value="20242">20242</option>
                        <option value="20241">20241</option>
                    </select>
                </div>
            </PopupModel>
        </Popup>
    );
}
