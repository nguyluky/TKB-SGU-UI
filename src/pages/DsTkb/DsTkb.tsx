import {
    faArrowDownAZ,
    faEllipsisVertical,
    faFolderOpen,
    faGrip,
    faList,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Popup from 'reactjs-popup';
import { TkbData } from '../../Service';
import DropDownButton from '../../components/DropDownButton';
import { headerContent } from '../../components/Layout/DefaultLayout';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import PopupModel from '../../components/PopupModel';
import { routerConfig } from '../../config';
import { globalContent } from '../../store/GlobalContent';
import Loader from '../components/Loader';
import { CardTkb } from './CardTkb';
import style from './DsTkb.module.scss';
import { Convert } from './FileTkb';
import { NewTkb } from './NewTkb';

export const cx = classNames.bind(style);

export interface FileTkb {
    name: string;
    created: string;
    data: Datum[];
}

export interface Datum {
    mhp: string;
    ten: string;
    nhom: string;
    id_to_hoc: string;
}

export interface DsTkbRep {
    code: number;
    msg: string;
    success: boolean;
    data?: TkbData[];
}

function DsTkb() {
    const setHeaderPar = useContext(headerContent);
    const [globalState] = useContext(globalContent);

    const [isLoading, setLoading] = useState(true);
    const [dsTkb, setDsTkb] = useState<TkbData[]>([]);
    const [isRow, setIsRow] = useState<boolean>(false);
    const [pos, setPos] = useState('client');
    const [uploadTkbShow, setUploadTkbShow] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const onDeletehandle = (tkbData: TkbData) => {
        if (!tkbData.isClient) {
            globalState.client.serverApi.deleteTkb(tkbData.id).then((e) => {
                console.log(e);
                if (!e.success) {
                    notifyMaster.error(e.msg);
                    return;
                }
                setDsTkb((j) => {
                    var i = j.findIndex((i) => i.id === tkbData.id);
                    if (i >= 0) j.splice(i, 1);
                    return [...j];
                });
            });
            return;
        }

        globalState.client.localApi.deleteTkb(tkbData.id).then((e) => {
            console.log(e);
            if (!e.success) {
                notifyMaster.error(e.msg);
                return;
            }
            setDsTkb((j) => {
                var i = j.findIndex((i) => i.id === tkbData.id);
                if (i >= 0) j.splice(i, 1);
                return [...j];
            });
        });
    };

    const onRenameHandle = (tkbData: TkbData, newName: string) => {
        if (tkbData.name === newName) return;
        tkbData.name = newName;
        if (!tkbData.isClient) {
            globalState.client.serverApi.updateTkb(tkbData).then((e) => {
                console.log(e);
                if (e.success) {
                    notifyMaster.success('Đổi tên thành công');
                }
            });
        } else {
            globalState.client.localApi.updateTkb(tkbData).then((e) => {
                console.log(e);
                if (e.success) {
                    notifyMaster.success('Đổi tên thành công');
                }
            });
        }
    };

    const onUpdateFileHandle = (e: ChangeEvent<HTMLInputElement>) => {
        if (!fileInputRef.current || !fileInputRef.current.files) return;
        var file = fileInputRef.current.files[0];

        if (!file) return;
        const reader = new FileReader();

        reader.readAsText(file, 'utf-8');

        reader.onload = () => {
            if (!reader.result) return;
            try {
                var fileTkb = Convert.toFileTkb(reader.result as string);

                (pos === 'client' ? globalState.client.localApi : globalState.client.serverApi)
                    .createNewTkb(
                        fileTkb.name,
                        '',
                        null,
                        false,
                        fileTkb.data.map((e) => e.id_to_hoc),
                        fileTkb.data.map((e) => e.mhp),
                    )
                    .then((e) => {
                        setUploadTkbShow(false);
                        if (!e.success) {
                            notifyMaster.error(e.msg);
                            return;
                        }

                        setDsTkb((j) => {
                            if (e.data) return [e.data, ...j];
                            return [...j];
                        });
                        notifyMaster.success('Upload tkb thành công');
                    })
                    .catch((e) => {
                        setUploadTkbShow(false);
                        notifyMaster.success('Không thể kết upload tkb không biết lý do');
                    });
            } catch {
                notifyMaster.error('Format file không hợp lệ');
            }
        };
    };

    useEffect(() => {
        setDsTkb([]);
        setLoading(true);
        var getServerData = async () => {
            if (!globalState.client.islogin()) return [];

            var resp = await globalState.client.serverApi.getDsTkb();
            return resp.data || [];
        };

        var getLocalData = async () => {
            var resp = await globalState.client.localApi.getDsTkb();
            return resp.data || [];
        };

        Promise.all([getLocalData(), getServerData()]).then(([ld, sd]) => {
            setLoading(false);
            setDsTkb([...ld, ...sd]);
        });

        console.log('setheader');
        setHeaderPar((e) => {
            e.left = (
                <Link to={routerConfig.home} style={{ textDecoration: 'none' }}>
                    <h3 style={{ color: 'var(--text-color)' }}>TKB SGU</h3>
                </Link>
            );
            e.center = undefined;
            e.right = undefined;

            return { ...e };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalState.client]);

    return (
        <div className={cx('DsTkb')}>
            <div className={cx('template-tkb')}>
                <div className={cx('template-wrapper')}>
                    <header className={cx('template-header-wrapper')}>
                        <div className={cx('left')}>
                            <span>Bắt đầu thời khoá biểu mới</span>
                        </div>
                        <div className={cx('right')}>
                            <DropDownButton
                                icon={faEllipsisVertical}
                                className={cx('activity-btn')}
                            >
                                <p>ẩn template</p>
                            </DropDownButton>
                        </div>
                    </header>
                    <div className={cx('content')}>
                        <NewTkb />
                    </div>
                </div>
            </div>

            <div className={cx('list-tkb')}>
                <div className={cx('list-tkb-wrapper')}>
                    <header className={cx('template-list-wrapper')}>
                        <div className={cx('left')}>
                            <span>Thời khoá biểu đã lưu</span>
                        </div>
                        <div className={cx('right')}>
                            <DropDownButton
                                className={cx('activity-btn')}
                                icon={isRow ? faGrip : faList}
                                onClick={() => setIsRow((e) => !e)}
                            />
                            <DropDownButton className={cx('activity-btn')} icon={faArrowDownAZ} />
                            <DropDownButton
                                className={cx('activity-btn')}
                                icon={faFolderOpen}
                                onClick={() => {
                                    setUploadTkbShow(true);
                                }}
                            />
                        </div>
                    </header>
                    <div className={cx('content')}>
                        <Loader isLoading={isLoading}>
                            <>
                                {dsTkb.map((e) => {
                                    return (
                                        <CardTkb
                                            isRow={isRow}
                                            data={e}
                                            key={e.id}
                                            onDelete={onDeletehandle}
                                            onRename={onRenameHandle}
                                        />
                                    );
                                })}
                            </>
                        </Loader>
                    </div>

                    <Popup open={uploadTkbShow}>
                        <PopupModel
                            title="Upload tkb"
                            onCancel={() => {
                                setUploadTkbShow(false);
                            }}
                            onOk={onUpdateFileHandle}
                        >
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
                </div>
            </div>
        </div>
    );
}

export default DsTkb;
