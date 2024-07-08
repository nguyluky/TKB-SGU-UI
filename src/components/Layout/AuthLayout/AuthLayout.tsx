import classNames from 'classnames/bind';
import NotifyPopup from '../../NotifyPopup';
import style from './AuthLayout.module.scss';

const cx = classNames.bind(style);

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <NotifyPopup>
            <div className={cx('wrapper')}>
                <div className={cx('bubbles')}>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                    <div className={cx('bubble')}></div>
                </div>

                <div className={cx('content')}>{children}</div>
            </div>
        </NotifyPopup>
    );
}

export default AuthLayout;
