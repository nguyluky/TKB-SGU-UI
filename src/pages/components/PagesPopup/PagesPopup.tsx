import classNames from 'classnames/bind';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { PopupProps } from 'reactjs-popup/dist/types';
import notifyMaster from '../../../components/NotifyPopup/NotificationManager';
import PopupModel from '../../../components/PopupModel';
import { TkbData } from '../../../Service';
import { globalContent } from '../../../store/GlobalContent';
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
                    <label form="inputName">New Name: </label>
                    <input type="text" name="inputName" value={lastName} onChange={(event) => setLastName(event.target.value)} />
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
                    <input type="text" name="inputname" value={name} onChange={(event) => setName(event.target.value)} />
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

interface UploadTkbProps extends Omit<PopupProps, 'children'> {
    uploadTkb: (file: File, pos: string) => void;
}

export function UploadTkb({ uploadTkb, ...pros }: UploadTkbProps) {
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
                    <select name="pos" id="pos" value={pos} onChange={(e) => setPos(e.target.value)}>
                        <option value="client">Client</option>
                        <option value="server">Server</option>
                    </select>
                </div>
            </PopupModel>
        </Popup>
    );
}

interface CloneTkbProps extends Omit<PopupProps, 'children'> {
    onClone: (name: string, pos: string) => void;
}

export function CloneTkb({ onClone, ...pros }: CloneTkbProps) {
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
                    <input type="text" name="inputname" value={lastName} onChange={(event) => setLastName(event.target.value)} />
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

interface PropertyProps extends Omit<PopupProps, 'children'> {
    tkbData: TkbData;
}

export function Property({ tkbData, ...props }: PropertyProps) {
    const [tab, setTab] = useState<number>(0);

    return (
        <Popup {...props}>
            <PopupModel title="Properties" noFooter>
                <div className={cx('properties-content')}>
                    <div className={cx('side-bar')}>
                        <label className={cx('side-bar-line')}>
                            <input
                                type="radio"
                                name="setting-tab"
                                checked={tab === 0}
                                onChange={(e) => {
                                    if (e.target.checked) setTab(0);
                                }}
                            />
                            General
                        </label>
                        <label className={cx('side-bar-line')}>
                            <input
                                type="radio"
                                name="setting-tab"
                                checked={tab === 1}
                                onChange={(e) => {
                                    if (e.target.checked) setTab(1);
                                }}
                            />
                            Member
                        </label>

                        <label className={cx('side-bar-line', 'end')}>Delete</label>
                    </div>
                    <div className={cx('body')}>
                        {tab === 0 ? (
                            <>
                                <div className={cx('setting-line')}>
                                    <span>Name:</span>
                                    <span>{tkbData.name}</span>
                                </div>

                                <div className={cx('setting-line')}>
                                    <span>Describe:</span>
                                    <span>{tkbData.tkb_describe}</span>
                                </div>

                                <div className={cx('setting-line')}>
                                    <span>quyền hạn:</span>
                                    <span>{tkbData.rule}</span>
                                </div>

                                <div className={cx('setting-line')}>
                                    <span>Members:</span>
                                    <span>1</span>
                                </div>

                                <div className={cx('setting-line')}>
                                    <span>ngày tạo:</span>
                                    <span>{tkbData.created.toISOString()}</span>
                                </div>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </PopupModel>
        </Popup>
    );
}

interface SharePopupProps extends Omit<PopupProps, 'children'> {
    tkbid: string;
}

export function SharePopup({ tkbid, ...pros }: SharePopupProps) {
    // const [pos, setPos] = useState('read');
    const [globalState] = useContext(globalContent);

    const [link, setLine] = useState('Đang lấy');

    const copyHandel = () => {
        navigator.clipboard.writeText(`${window.location.origin}/join/${link}`).then(() => {
            notifyMaster.success('Copy thành công');
        });
    };

    useEffect(() => {
        globalState.client.serverApi.createInviteLink(tkbid).then((e) => {
            if (!e.success) {
                notifyMaster.error(e.msg);
                return;
            }
            setLine(e.data || '');
        });
    }, [globalState.client.serverApi, tkbid]);

    return (
        <Popup {...pros}>
            <PopupModel title="Tại lời mời" onCancel={pros.onClose} noFooter>
                <div className={cx('input')}>
                    <label>link: (tính năng đang ở bản beta cẫn chưa cập nhật read time)</label>
                    <div className={cx('input-copy')}>
                        <p>
                            {window.location.origin}/join/{link}
                        </p>
                        <button className={cx('button-copy')} onClick={copyHandel}>
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                    </div>
                </div>
            </PopupModel>
        </Popup>
    );
}
