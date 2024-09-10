import classNames from 'classnames/bind';
import { useState } from 'react';
import { Cloud, CloudOff, CloudUpload } from '../../assets/svg/index';

import { Rename } from '../components/PagesPopup';
import style from './ReName.module.scss';
const icons = {
    saved: <Cloud />,
    notsave: <CloudOff />,
    saving: <CloudUpload />,
};

const cx = classNames.bind(style);

export function ReName({
    defaultName,
    onChangeName,
    isSave,
    isReadOnly,
}: {
    defaultName: string;
    onChangeName?: (s: string) => void;
    isSave: 'saved' | 'notsave' | 'saving';
    isReadOnly?: boolean;
}) {
    const [show, setShow] = useState(false);

    const renameHandle = (newName: string) => {
        if (onChangeName) onChangeName(newName);
        setShow(false);
    };

    return (
        <div className={cx('rename-header')}>
            {isReadOnly ? (
                <>
                    <p>readOnly</p>
                    <p>-</p>
                </>
            ) : (
                ''
            )}

            <p
                onClick={() => {
                    setShow(true);
                }}
            >
                {defaultName}
            </p>

            {icons[isSave]}

            <Rename
                open={show}
                currName={defaultName}
                onRename={renameHandle}
                onClose={() => setShow(false)}
            />
        </div>
    );
}
