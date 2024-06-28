import classNames from 'classnames/bind';
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { faArrowDownAZ, faEllipsisVertical, faGrip } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

import DropDownButton from '../../components/DropDownButton';
import { globalContent } from '../../store/GlobalContent';
import Loader from '../components/Loader';
import style from './DsTkb.module.scss';
import { NewTkb } from './NewTkb';
import { headerContent } from '../../components/Layout/DefaultLayout';
import images from '../../assets/images';
import Popup from 'reactjs-popup';
import { TkbData } from '../../Service';

export const cx = classNames.bind(style);

export interface DsTkbRep {
    code: number;
    msg: string;
    success: boolean;
    data?: TkbData[];
}

function CardTkb({ data }: { data: TkbData }) {
    // const [isShow, setShow] = useState(false);

    const nati = useNavigate();

    return (
        <div
            className={cx('card')}
            onClick={() => {
                nati(data.id + (data.isClient ? '?isclient=true' : ''));
            }}
        >
            <div className={cx('thumbnail')}>
                <div className={cx('icon-wrapper')}>
                    {data.thumbnails ? (
                        <p>imge</p>
                    ) : (
                        <img src={images.missingPicture} alt="Missing" />
                    )}
                </div>
            </div>
            <div className={cx('body')}>
                <div className={cx('info')}>
                    <p className={cx('name')}>{data.name}</p>
                    <p className={cx('date')}>{data.created.toLocaleDateString('en-US')}</p>
                </div>

                <Popup
                    arrow={false}
                    trigger={
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </div>
                    }
                >
                    <div className={cx('content-menu')}>
                        <span className={cx('item')}>Mở ở thẻ mới</span>
                        <span className={cx('item')}>Đổi tên</span>
                        <span className={cx('item')}>Xóa</span>
                    </div>
                </Popup>
            </div>
        </div>
    );
}

function DsTkb() {
    const setHeaderPar = useContext(headerContent);
    const [globalState] = useContext(globalContent);

    const [isLoading, setLoading] = useState(true);

    const [dsTkb, setDsTkb] = useState<TkbData[]>([]);

    useEffect(() => {
        setDsTkb([]);
        console.log('ok');
        if (globalState.client.islogin())
            globalState.client.request.get<DsTkbRep>('/tkbs').then((rep) => {
                setLoading(false);

                // NOTE:
                // 1. đầu tiên lấy dữ liệu từ server
                // 2. lấy tkb được lưu trong local
                // 3. sử lý khi không có data trả về
                if (!rep.data.success || !rep.data.data) {
                    // TODO: chưa làm sử lý trường hợp không có data

                    return;
                }

                rep.data.data.forEach((e) => {
                    e.created = new Date(e.created);
                });

                setDsTkb((e) => {
                    return [...e, ...(rep.data.data || [])];
                });
            });
        else {
            setLoading(false);
        }

        // TODO: ok
        var dsTkbClient: TkbData[] = JSON.parse(localStorage.getItem('sdTkb') || '[]');
        // console.log(dsTkbClient);
        dsTkbClient.forEach((e) => {
            e.created = new Date(e.created);
        });

        setDsTkb((e) => {
            return [...e, ...dsTkbClient];
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
