import classNames from 'classnames/bind';
import { useContext, useRef, useState } from 'react';
import Popup from '../../../components/Popup';
import { PopupProps } from '../../../components/Popup/types';
import PopupModel from '../../../components/PopupModel';
import { globalContent } from '../../../store/GlobalContent';
import style from './PagesPopup.module.scss';

const cx = classNames.bind(style);

interface UploadTkbProps extends Omit<PopupProps, 'children'> {
    uploadTkb: (file: File, pos: string) => void;
}

export default function UploadTkb({ uploadTkb, ...pros }: UploadTkbProps) {
    const [globoalState] = useContext(globalContent);

    const [pos, setPos] = useState<string>('server');
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
                {/* <div className={cx('input')}>
                    <label>Vị trí lưu</label>
                    <select name="pos" id="pos" value={pos} onChange={(e) => setPos(e.target.value)}>
                        <option value="client">Client</option>
                        <option value="server" disabled={!!!globoalState.userInfo}>
                            Server
                        </option>
                    </select>
                </div> */}
            </PopupModel>
        </Popup>
    );
}
