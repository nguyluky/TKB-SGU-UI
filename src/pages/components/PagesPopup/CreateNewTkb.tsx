import classNames from 'classnames/bind';

import { useState } from 'react';
import Popup from 'reactjs-popup';
import { PopupProps } from 'reactjs-popup/dist/types';
import PopupModel from '../../../components/PopupModel';
import style from './PagesPopup.module.scss';

const cx = classNames.bind(style);

interface CreateNewTkbProps extends Omit<PopupProps, 'children'> {
    onCreate: (name: string, pos: string) => void;
}

export default function CreateNewTkb({ onCreate, ...props }: CreateNewTkbProps) {
    const [name, setName] = useState<string>('Thời khóa biểu');
    const [pos, setPos] = useState<string>('client');

    return (
        <Popup {...props}>
            <PopupModel
                title="Tạo mới"
                onCancel={props.onClose}
                onOk={() => {
                    onCreate(name, pos);
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
    );
}
