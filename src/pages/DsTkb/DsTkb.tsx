import {
    faArrowDownAZ,
    faEllipsisVertical,
    faFolder,
    faGrip,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';

import { TkbData } from '../../Service';
import DropDownButton from '../../components/DropDownButton';
import { headerContent } from '../../components/Layout/DefaultLayout';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import { globalContent } from '../../store/GlobalContent';
import Loader from '../components/Loader';
import { CardTkb } from './CardTkb';
import style from './DsTkb.module.scss';
import { NewTkb } from './NewTkb';

export const cx = classNames.bind(style);

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

    useEffect(() => {
        setDsTkb([]);
        setLoading(true);
        var getServerData = async () => {
            if (!globalState.client.islogin()) return [];

            var resp = await globalState.client.serverApi.getDsTkb();

            return (resp.data || []).map((e) => {
                e.created = new Date(e.created);
                return e;
            });
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
            e.left = <h3 style={{ color: 'var(--text-color)' }}>TKB SGU</h3>;
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
                                icon={faGrip}
                            ></DropDownButton>
                            <DropDownButton
                                className={cx('activity-btn')}
                                icon={faArrowDownAZ}
                            ></DropDownButton>
                            <DropDownButton className={cx('activity-btn')} icon={faFolder}>
                                <p>ẩn template</p>
                            </DropDownButton>
                        </div>
                    </header>
                    <div className={cx('content')}>
                        <Loader isLoading={isLoading}>
                            <>
                                {dsTkb.map((e) => {
                                    return (
                                        <CardTkb
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
        </div>
    );
}

export default DsTkb;
