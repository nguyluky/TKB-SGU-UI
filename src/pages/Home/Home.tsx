import classNames from 'classnames/bind';
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import images from '../../assets/images';
import { headerContent } from '../../components/Layout/DefaultLayout';
import style from './Home.module.scss';

const cx = classNames.bind(style);

function Home() {
    const setHeaderPar = useContext(headerContent);

    useEffect(() => {
        console.log('set header');
        setHeaderPar((e) => {
            e.left = <h3 style={{ color: 'var(--text-color)' }}>TKB SGU</h3>;
            return { ...e };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('wrapper', 'main')}>
            <div className={cx('container')}>
                <div className={cx('item')}></div>
                <div className={cx('item')}>
                    <div className={cx('logo')}>
                        <img src={images.logo} alt="logo" />
                        <span>TKB SGU</span>
                    </div>
                    <h1>Làm chủ thời gian của bạn</h1>
                    <p>Chỉ cần vài phút, là bạn đã có một thời khoá biểu đẹp</p>

                    <Link to={'/tkbs'} className={cx('button')}>
                        Lest go
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
