import classNames from 'classnames/bind';
import { useState } from 'react';
import notifyMaster from '../../../components/NotifyPopup/NotificationManager';
import Popup from '../../../components/Popup';
import { PopupProps } from '../../../components/Popup/types';
import PopupModel from '../../../components/PopupModel';
import style from './PagesPopup.module.scss';

const cx = classNames.bind(style);

interface CloneTkbProps extends Omit<PopupProps, 'children'> {
    onClone: (name: string, pos: string) => void;
}

export default function CloneTkb({ onClone, ...pros }: CloneTkbProps) {
    const [lastName, setLastName] = useState<string>('');
    const [pos, setPos] = useState<string>('client');

    const onOk = () => {
        if (!lastName) {
            notifyMaster.error('Tên tkb không được để chống');
            return;
        }
        onClone(lastName, pos);
    };

    return (
        <Popup {...pros}>
            <PopupModel title="Upload tkb" onCancel={pros.onClose} onOk={onOk}>
                <div className={cx('input')}>
                    <label form="inputname">New Name: </label>
                    <input
                        type="text"
                        name="inputname"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                    />
                </div>
                <div className={cx('input')}>
                    <label>Vị trí lưu</label>
                    <select name="pos" id="pos" value={pos} onChange={(e) => setPos(e.target.value)}>
                        <option value="client">Client</option>
                        <option value="server">Server</option>
                    </select>
                </div>
            </PopupModel>
        </Popup>
    );
}
