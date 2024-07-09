import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBug, faGear, faMoon, faSun, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNamesBind from 'classnames/bind';
import { ChangeEvent, ReactElement, useContext } from 'react';
import { Link } from 'react-router-dom';

import images from '../../../../assets/images';

import { routerConfig } from '../../../../config';
import { Client } from '../../../../Service';
import { globalContent } from '../../../../store/GlobalContent';
import DropDownButton from '../../../DropDownButton/DropDownButton';
import style from './Header.module.scss';

const cx = classNamesBind.bind(style);

function Header({
    left,
    center,
    right,
}: {
    left?: ReactElement;
    center?: ReactElement;
    right?: ReactElement;
}) {
    const [globalState, setGlobalState] = useContext(globalContent);

    const openGitHub = () => {
        window.open('https://github.com/nguyluky/TKB-SGU-UI');
    };

    const openIssues = () => {
        window.open('https://github.com/nguyluky/TKB-SGU-UI/issues');
    };

    const openDiscord = () => {
        window.open('https://discord.com/');
    };

    const handelChangeTheme = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked && globalState && setGlobalState) {
            globalState.theme = event.target.value;
            window.localStorage.setItem('theme', event.target.value);
            setGlobalState({ ...globalState });
        }
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('left')}>
                <div className={cx('icon')}>
                    <Link to={'/'} className={cx('button')}>
                        <img src={images.logo} alt="logo" />
                    </Link> 
                </div>
                {left}
            </div>
            <div className={cx('center')}>{center}</div>
            <div className={cx('right')}>
                {right}
                <div className={cx('activity')}>
                    <DropDownButton icon={faDiscord} onClick={openDiscord} className={cx('item')} />
                    <DropDownButton icon={faBug} onClick={openIssues} className={cx('item')} />
                    <DropDownButton icon={faGithub} onClick={openGitHub} className={cx('item')} />
                    <DropDownButton icon={faSun} className={cx('item')}>
                        <div className={cx('container')}>
                            <label>
                                <input
                                    type="radio"
                                    name="theme"
                                    checked={globalState?.theme === 'light'}
                                    value={'light'}
                                    onChange={handelChangeTheme}
                                />
                                <FontAwesomeIcon icon={faSun} />
                                <p>Light Mode</p>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="theme"
                                    value={'dark'}
                                    checked={globalState?.theme === 'dark'}
                                    onChange={handelChangeTheme}
                                />
                                <FontAwesomeIcon icon={faMoon} />
                                <p>Dark Mode</p>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="theme"
                                    value={'auto'}
                                    checked={globalState?.theme === 'auto'}
                                    onChange={handelChangeTheme}
                                />
                                <FontAwesomeIcon icon={faGear} />
                                <p>System</p>
                            </label>
                        </div>
                    </DropDownButton>
                    <DropDownButton icon={faUser} className={cx('item')}>
                        <div className={cx('user-info')}>
                            {globalState.client.islogin() ? (
                                <>
                                    <div className={cx('user-info')}></div>
                                    <div className={cx('line', 'change-password')}>
                                        <Link to={routerConfig.changePassword}>Đổi mật khẩu</Link>
                                    </div>
                                    <div
                                        className={cx('line')}
                                        onClick={() => {
                                            window.localStorage.setItem('token', '');
                                            setGlobalState((e) => {
                                                e.client = new Client();
                                                return { ...e };
                                            });
                                        }}
                                    >
                                        Đăng xuất
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={cx('line')}>
                                        <Link to={routerConfig.logInUp}>Đăng nhập</Link>
                                    </div>
                                    <div className={cx('line')}>
                                        <Link to={routerConfig.logInUp + '?up=t'}>Đăng ký</Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </DropDownButton>
                </div>
            </div>
        </header>
    );
}

export default Header;
