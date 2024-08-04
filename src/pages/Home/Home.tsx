import classNames from 'classnames/bind';
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '../../assets/images';
import { headerContent } from '../../components/Layout/DefaultLayout';
import { routerConfig } from '../../config';
import style from './Home.module.scss';

const cx = classNames.bind(style);

function Home() {
    const setHeaderPar = useContext(headerContent);

    useEffect(() => {
        console.log('set header');
        setHeaderPar((e) => {
            e.left = (
                <Link to={routerConfig.home} style={{ textDecoration: 'none' }}>
                    <h3 style={{ color: 'var(--text-color)' }}>TKB SGU</h3>
                </Link>
            );
            e.right = undefined;
            e.center = undefined;
            return { ...e };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container', 'main')}>
                <div className={cx('item')}></div>
                <div className={cx('item')}>
                    <div className={cx('logo')}>
                        <img src={images.logo} alt="logo" />
                        <span>TKB SGU</span>
                    </div>
                    <h1>Lịch học ngay trong tầm tay</h1>
                    <p>Chỉ cần vài phút, là bạn đã có một thời khoá biểu đẹp</p>
                    <p>Tại sao phải khổ sở trên web, khi ta có thể xài tool 😎</p>
                    <Link to={'/tkbs'} className={cx('button')}>
                        <button className={cx('buttonHome')}>Bắt Đầu</button>
                    </Link>
                </div>
            </div>

            <div className={cx('tn')}>
                <p>Tính năng nổi bật</p>
                <FontAwesomeIcon icon={faChevronDown} />
            </div>
        </div>
    );
}

export default Home;
