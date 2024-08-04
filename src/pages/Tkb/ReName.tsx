import { useState } from 'react';
import SvgIcon from '../../assets/svg/index';

import { RenameModal } from '../components/PagesPopup';
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

            <RenameModal
                open={show}
                currName={defaultName}
                onRename={renameHandle}
                onClose={() => setShow(false)}
            />
        </div>
    );
}
