import classNames from 'classnames/bind';

import style from './DsTkb.module.scss';
import Loader from '../components/Loader';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DropDownButton from '../../components/DropDownButton';
import { faArrowDownAZ, faEllipsisVertical, faGrip, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import Test from '../Test/Test';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from 'reactjs-popup';
import PopupModel from '../../components/PopupModel';

const cx = classNames.bind(style);

function Tkb({ className }: { className: string }) {
    return <div className={cx('tkb-item')}></div>;
}

function NewTkb() {
    const [isShow, setShow] = useState(false);
    const [name, setName] = useState('untitled');

    return (
        <div className={cx('card', 'new')} onClick={() => setShow(true)}>
            <div className={cx('thumbnail')}>
                <div className={cx('icon-wrapper')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
                            <stop offset="0%" stopColor="#D16BA5" />
                            <stop offset="50%" stopColor="#86A8E7" />
                            <stop offset="100%" stopColor="#5FFBF1" />
                        </linearGradient>
                        <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" fill="url(#grad1)"></path>
                    </svg>
                </div>
            </div>
            <div className={cx('info')}>
                <p className={cx('name')}>Tạo mới</p>
            </div>

            <Popup open={isShow} onClose={() => setShow(false)}>
                <PopupModel
                    title="Tại mới"
                    onCancel={() => setShow(false)}
                    onOk={() => {
                        console.log(name);
                    }}
                >
                    <div className={cx('input')}>
                        <label form="inputname">Name</label>
                        <input type="text" name="inputname" value={name} onChange={(event) => setName(event.target.value)} />
                    </div>

                    <div className={cx('input')}>
                        <label>Vị trí lưu</label>
                        <select name="pos" id="pos">
                            <option value="client">client</option>
                            <option value="server">server</option>
                        </select>
                    </div>
                </PopupModel>
            </Popup>
        </div>
    );
}

function DsTkb() {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
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
