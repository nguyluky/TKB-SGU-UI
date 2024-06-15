import classNames from 'classnames/bind';

import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { faArrowDownAZ, faEllipsisVertical, faGrip } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import DropDownButton from '../../components/DropDownButton';
import { globalContent } from '../../store/GlobalContent';
import Loader from '../components/Loader';
import style from './DsTkb.module.scss';
import { NewTkb } from './NewTkb';

export const cx = classNames.bind(style);

function Tkb({ className }: { className: string }) {
    return <div className={cx('tkb-item')}></div>;
}

function DsTkb() {
    const [globalState, setGlobalState] = useContext(globalContent);

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        globalState.client.request.get('/tkbs').then((rep) => {
            setLoading(false);
            console.log(rep);
        });
        // setTimeout(() => {
        //     setLoading(false);
        // }, 2000);
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
                            <p>hello</p>
                        </Loader>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DsTkb;
