import classNames from 'classnames/bind';

import { useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { PopupProps } from 'reactjs-popup/dist/types';
import PopupModel from '../../../components/PopupModel';
import style from './PagesPopup.module.scss';

const cx = classNames.bind(style);

interface RenameModalProps extends Omit<PopupProps, 'children'> {
    onRename: (newName: string) => void;
    currName: string;
}
export function RenameModal({ onRename, currName, ...props }: RenameModalProps) {
    const [lastName, setLastName] = useState<string>(currName);

    const onRenameHandel = () => {
        onRename(lastName);
    };

    return (
        <Popup {...props}>
            <PopupModel title="Rename Tkb" onCancel={props.onClose} onOk={onRenameHandel}>
                <div className={cx('input')}>
                    <label form="inputname">New Name: </label>
                    <input
                        type="text"
                        name="inputname"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                    />
                </div>
            </PopupModel>
        </Popup>
    );
}

interface CreateNewTkbProps extends Omit<PopupProps, 'children'> {
    onCreate: (name: string, pos: string) => void;
}

export function CreateNewTkb({ onCreate, ...props }: CreateNewTkbProps) {
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

interface UploadTkbProps extends Omit<PopupProps, 'children'> {
    uploadTkb: (file: File, pos: string) => void;
}

export function UploadTkb({ uploadTkb, ...pros }: UploadTkbProps) {
    const [pos, setPos] = useState<string>('client');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadHandel = () => {
        if (!fileInputRef.current || !fileInputRef.current.files) return;
        var file = fileInputRef.current.files[0];

        if (!file) return;
        uploadTkb(file, pos);
    };

    return (
        <Popup {...pros}>
            <PopupModel title="Upload tkb" onCancel={pros.onClose} onOk={uploadHandel}>
                <div className={cx('input', 'upload-file')}>
                    <label form="inputname">Name</label>
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
