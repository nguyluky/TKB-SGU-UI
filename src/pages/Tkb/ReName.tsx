import { faCloud, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Popup from 'reactjs-popup';

import PopupModel from '../../components/PopupModel';
import { cx } from './Tkb';

export function ReName({
    defaultName,
    onChangeName,
    isSave,
}: {
    defaultName: string;
    onChangeName?: (s: string) => void;
    isSave: boolean;
}) {
    const [lastName, setLastName] = useState(defaultName);
    const [show, setShow] = useState(false);

    const renameHandle = () => {
        if (onChangeName) onChangeName(lastName);
        setShow(false);
    };

    return (
        <div className={cx('rename-header')}>
            <p
                onClick={() => {
                    setLastName(defaultName);
                    setShow(true);
                }}
            >
                {defaultName}
            </p>

            <FontAwesomeIcon icon={isSave ? faRotate : faCloud} />

            <Popup open={show}>
                <PopupModel
                    title="Đổi tên TKB"
                    onCancel={() => {
                        setShow(false);
                    }}
                    onOk={renameHandle}
                >
                    <div className={cx('input')}>
                        <label form="inputname">Tên Mới: </label>
                        <input
                            type="text"
                            name="inputname"
                            value={lastName}
                            onChange={(event) => setLastName(event.target.value)}
                        />
                    </div>
                </PopupModel>
            </Popup>
        </div>
    );
}
