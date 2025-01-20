import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';

import images from '../../assets/images';
import { headerContent } from '../../components/Layout/DefaultLayout';
import { routerConfig } from '../../config';
import motionConfig from '../../config/motionConfig';
import Footer from '../components/Footer';
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
        <SimpleBar
            style={{
                maxHeight: '100%',
            }}
        >
            <motion.div {...motionConfig} className={cx('wrapper')}>
                <div className={cx('container', 'main')}>
                    <div className={cx('item')}></div>
                    <div className={cx('item')}>
                        <div>
                            <div className={cx('logo')}>
                                <img src={images.logo} alt="logo" />
                                <span>TKB SGU</span>
                            </div>
                            <h1>Thời khóa biểu thông minh - Lập kế hoạch học tập hiệu quả</h1>
                            <p>
                                Bạn đang gặp khó khăn với việc quản lý thời gian học của mình? Vậy bán đến đúng nơi rồi
                                đó. Trang web của chúng tôi được thiết kế đặc biệt để giúp bạn quản lý thời khóa biểu
                                một cách dễ dàng và trực quan. Bạn sẽ không còn phải loay hoay với những dòng chữ dài
                                dòng nữa. Vậy bắt đầu thôi nào.😊
                            </p>

                            <div className={cx('button-start-wrapper')}>
                                <Link to={'/tkbs'} className={cx('button')}>
                                    <button className={cx('buttonHome')}>Bắt Đầu</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx('tn')}>
                    <p>Tính năng nổi bật</p>
                    <FontAwesomeIcon icon={faChevronDown} />
                </div>

                <div className={cx('container')}>
                    <div className={cx('item')}>
                        <div>
                            <h1>Nhập liệu nhanh chóng, chính xác.</h1>
                            <p>
                                Với nhiều tính năng hỗ trợ bạn có thể dễ dàng chọn cho mình những môn học mình mong muốn
                                trong 714 và nhóm học trong 1529. 😊
                            </p>
                        </div>
                    </div>
                    <div className={cx('item')}>
                        <img src={images.homeImg1} alt="" />
                    </div>
                </div>
                <div className={cx('container')}>
                    <div className={cx('item')}>
                        <img src={images.homeImg2} alt="" />
                    </div>
                    <div className={cx('item')}>
                        <div>
                            <h1>Hiển thị thời khóa biểu trực quan.</h1>
                            <p>
                                Thay vì đọc những dòng chữ dài dòng, bạn có thể dễ dàng nhìn thấy thời khóa biểu của
                                mình được hiển thị trên một bảng trực quan, giúp bạn nắm bắt thông tin một cách nhanh
                                chóng.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('container')}>
                    <div className={cx('item')}>
                        <div>
                            <h1>Không bị giới hạn. Coi mọi lúc mọi nơi.</h1>
                            <p>Bạn có thể xem trước thời khóa biểu ngay cả khi chưa đến thời gian đăng ký.</p>
                        </div>
                    </div>
                    <div className={cx('item')}></div>
                </div>
            </motion.div>
            <Footer></Footer>
        </SimpleBar>
    );
}

export default Home;
