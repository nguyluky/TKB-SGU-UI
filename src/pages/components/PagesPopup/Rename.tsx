import classNames from 'classnames/bind';

import { useState } from 'react';
import Popup from 'reactjs-popup';
import { PopupProps } from 'reactjs-popup/dist/types';
import PopupModel from '../../../components/PopupModel';
import style from './PagesPopup.module.scss';

const cx = classNames.bind(style);

interface RenameModalProps extends Omit<PopupProps, 'children'> {
    onRename: (newName: string) => void;
    currName: string;
}
export default function Rename({ onRename, currName, ...props }: RenameModalProps) {
    const [lastName, setLastName] = useState<string>(currName);

    const onRenameHandel = () => {
        onRename(lastName);
    };

    return (
        <Popup {...props}>
            <PopupModel title="Rename Tkb" onCancel={props.onClose} onOk={onRenameHandel}>
                <div className={cx('input')}>
                    <label form="inputName">New Name: </label>
                    <input
                        type="text"
                        name="inputName"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                    />
                </div>
            </PopupModel>
        </Popup>
    );
}
