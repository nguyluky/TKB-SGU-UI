import {
    faArrowDownAZ,
    faEllipsisVertical,
    faFolderOpen,
    faGrip,
    faList,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';

import DropDownButton from '../../components/DropDownButton';
import { headerContent } from '../../components/Layout/DefaultLayout';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import { routerConfig } from '../../config';
import { TkbInfo } from '../../Service';
import { globalContent } from '../../store/GlobalContent';
import Loader from '../components/Loader';
import { UploadTkb } from '../components/PagesPopup';
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
    data?: TkbInfo[];
}

function DsTkb() {
    const setHeaderPar = useContext(headerContent);
    const [globalState] = useContext(globalContent);

    const [sortBy] = useState<'name' | 'time' | ''>('');
    const [isLoading, setLoading] = useState(true);
    const [dsTkb, setDsTkb] = useState<TkbInfo[]>([]);
    const [isRow, setIsRow] = useState<boolean>(false);
    const [uploadTkbShow, setUploadTkbShow] = useState<boolean>(false);

    const onDeletehandle = (tkbData: TkbInfo) => {
        if (!tkbData.isClient) {
            globalState.client.serverApi.deleteTkb(tkbData.id).then((e) => {
                console.log(e);
                if (!e.success) {
                    notifyMaster.error(e.msg);
                    return;
                }
                setDsTkb((j) => {
                    const i = j.findIndex((i) => i.id === tkbData.id);
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
                const i = j.findIndex((i) => i.id === tkbData.id);
                if (i >= 0) j.splice(i, 1);
                return [...j];
            });
        });
    };

    const onRenameHandle = (tkbData: TkbInfo, newName: string) => {
        if (tkbData.name === newName) return;
        tkbData.name = newName;
        if (!tkbData.isClient) {
            globalState.client.serverApi.updateTkbInfo(tkbData).then((e) => {
                console.log(e);
                if (e.success) {
                    notifyMaster.success('Đổi tên thành công');
                }
            });
        } else {
            globalState.client.localApi.updateTkbInfo(tkbData).then((e) => {
                console.log(e);
                if (e.success) {
                    notifyMaster.success('Đổi tên thành công');
                }
            });
        }
    };

    const onUpdateFileHandle = (file: File, pos: string) => {
        const reader = new FileReader();

        reader.readAsText(file, 'utf-8');

        reader.onload = () => {
            if (!reader.result) return;
            try {
                const fileTkb = Convert.toFileTkb(reader.result as string);
                const api =
                    pos === 'client' ? globalState.client.localApi : globalState.client.serverApi;
                api.createNewTkb({ name: fileTkb.name, tkb_describe: '', thumbnails: null })
                    .then(async (e) => {
                        if (!e.success || !e.data?.id) {
                            notifyMaster.error('Upload tkb không thành công');
                            return;
                        }

                        await api.updateTkbContent(
                            e.data.id,
                            fileTkb.data.map((e) => e.id_to_hoc),
                        );
                        await api.updateTkbContentMmh(
                            e.data.id,
                            fileTkb.data.map((e) => e.mhp),
                        );
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
        const getServerData = async () => {
            if (!globalState.client.islogin()) return [];

            const resp = await globalState.client.serverApi.getDsTkb();
            return resp.data || [];
        };

        const getLocalData = async () => {
            const resp = await globalState.client.localApi.getDsTkb();
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
        <SimpleBar
            style={{
                maxHeight: '100%',
            }}
        >
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
                                <DropDownButton
                                    className={cx('activity-btn')}
                                    icon={faArrowDownAZ}
                                />
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
                                    {[...dsTkb]
                                        .sort((a, b) => {
                                            if (sortBy === 'time') {
                                                return a.created.getTime() - b.created.getTime();
                                            }

                                            if (sortBy === 'name') {
                                                return a.name.localeCompare(b.name);
                                            }
                                            return 0;
                                        })
                                        .map((e) => {
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
                    </div>
                </div>

                <UploadTkb
                    open={uploadTkbShow}
                    onClose={() => setUploadTkbShow(false)}
                    uploadTkb={onUpdateFileHandle}
                />
            </div>
        </SimpleBar>
    );
}

export default DsTkb;
