import { useState } from 'react';
import Popup from 'reactjs-popup';
import SvgIcon from '../../assets/svg/index';
import PopupModel from '../../components/PopupModel';

import { cx } from './Tkb';

const icons = {
    saved: <SvgIcon.Cloud />,
    notsave: <SvgIcon.CloudOff />,
    saving: <SvgIcon.CloudUpload />,
};

export function ReName({
    defaultName,
    onChangeName,
    isSave,
}: {
    defaultName: string;
    onChangeName?: (s: string) => void;
    isSave: 'saved' | 'notsave' | 'saving';
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

            {icons[isSave]}

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
