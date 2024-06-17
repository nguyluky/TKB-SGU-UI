import classNames from 'classnames/bind';

import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { faArrowDownAZ, faEllipsisVertical, faGrip } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import DropDownButton from '../../components/DropDownButton';
import { globalContent } from '../../store/GlobalContent';
import Loader from '../components/Loader';
import style from './DsTkb.module.scss';
import { NewTkb } from './NewTkb';
import { useNavigate } from 'react-router-dom';
import { headerContent } from '../../components/Layout/DefaultLayout';

export const cx = classNames.bind(style);

function Tkb({ className }: { className: string }) {
    return <div className={cx('tkb-item')}></div>;
}

export interface DsTkbRep {
    code: number;
    msg: string;
    success: boolean;
    data?: DsTkbData[];
}

export interface DsTkbData {
    id: string;
    name: string;
    tkb_describe: string;
    thumbnails: null;
    ma_hoc_phans: string[];
    id_to_hocs: string[];
    rule: number;
    created: Date; //"2024-06-17T12:22:36.000Z"
}

function CardTkb({ data }: { data: DsTkbData }) {
    const [isShow, setShow] = useState(false);

    const nati = useNavigate();

    return (
        <div
            className={cx('card')}
            onClick={() => {
                nati(data.id);
            }}
        >
            <div className={cx('thumbnail')}>
                <div className={cx('icon-wrapper')}></div>
            </div>
            <div className={cx('info')}>
                <p className={cx('name')}>{data.name}</p>
                <p className={cx('name')}>{data.created.toLocaleDateString('en-US')}</p>
            </div>
        </div>
    );
}

function DsTkb() {
    const setHeaderPar = useContext(headerContent);
    const [globalState, setGlobalState] = useContext(globalContent);

    const [isLoading, setLoading] = useState(true);

    const [dsTkb, setDsTkb] = useState<DsTkbData[]>([]);

    useEffect(() => {
        globalState.client.request.get<DsTkbRep>('/tkbs').then((rep) => {
            setLoading(false);

            // NOTE:
            // 1. đầu tiên lấy dữ liệu từ server
            // 2. lấy tkb được lưu trong local
            // 3. sử lý khi không có data trả về
            if (!rep.data.success || !rep.data.data) {
                // TODO: sử lý trường hợp không có data
                return;
            }

            rep.data.data.forEach((e) => {
                e.created = new Date(e.created);
            });

            setDsTkb(rep.data.data);
        });

        console.log('setheader');
        setHeaderPar((e) => {
            e.left = <h3 style={{ color: 'var(--text-color)' }}>TKB SGU</h3>;
            e.center = undefined;
            e.right = undefined;

            return { ...e };
        });
    }, []);

    return (
        <div className={cx('DsTkb')}>
            <div className={cx('template-tkb')}>
                <div className={cx('template-wrapper')}>
                    <header className={cx('template-header-wrapper')}>
                        <div className={cx('left')}>
                            <span>Bắt đầu thời khoá biểu mới</span>
                        </div>
                        <div className={cx('right')}>
                            <DropDownButton icon={faEllipsisVertical} className={cx('activity-btn')}>
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
                            <DropDownButton className={cx('activity-btn')} icon={faGrip}></DropDownButton>
                            <DropDownButton className={cx('activity-btn')} icon={faArrowDownAZ}></DropDownButton>
                            <DropDownButton className={cx('activity-btn')} icon={faFolder}>
                                <p>ẩn template</p>
                            </DropDownButton>
                        </div>
                    </header>
                    <div className={cx('content')}>
                        <Loader isLoading={isLoading}>
                            <>
                                {dsTkb.map((e) => {
                                    return <CardTkb data={e} key={e.id} />;
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
