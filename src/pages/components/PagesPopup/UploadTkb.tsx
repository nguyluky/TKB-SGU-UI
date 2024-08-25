import classNames from 'classnames/bind';
import { useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { PopupProps } from 'reactjs-popup/dist/types';
import PopupModel from '../../../components/PopupModel';
import style from './PagesPopup.module.scss';

const cx = classNames.bind(style);

interface UploadTkbProps extends Omit<PopupProps, 'children'> {
    uploadTkb: (file: File, pos: string) => void;
}

export default function UploadTkb({ uploadTkb, ...pros }: UploadTkbProps) {
    const [pos, setPos] = useState<string>('client');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadHandel = () => {
        if (!fileInputRef.current || !fileInputRef.current.files) return;
        const file = fileInputRef.current.files[0];

        if (!file) return;
        uploadTkb(file, pos);
    };

    return (
        <Popup {...pros}>
            <PopupModel title="Upload tkb" onCancel={pros.onClose} onOk={uploadHandel}>
                <div className={cx('input', 'upload-file')}>
                    <label form="inputname">File</label>
                    <input type="file" ref={fileInputRef} accept=".json" />
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
