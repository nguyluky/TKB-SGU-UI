import { ReactElement, useState, useRef, MouseEventHandler, useContext, ChangeEvent, useEffect } from 'react';
import classNamesBind from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faMoon, faSun, faUser } from '@fortawesome/free-solid-svg-icons';

import style from './Header.module.scss';
import images from '../../../../assets/images';
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { globalContent } from '../../../../store/GlobalContent';
import DropDownButton from '../../../DropDownButton/DropDownButton';
import { Link } from 'react-router-dom';
import routers from '../../../../config/routers';

const cx = classNamesBind.bind(style);

function Header({ left, center, right }: { left?: ReactElement; center?: ReactElement; right?: ReactElement }) {
    const [globalState, setGlobalState] = useContext(globalContent);
    const [islogin, setLogin] = useState(false);

    const openGitHub = () => {
        window.open('https://github.com/nguyluky/TKB-SGU-UI');
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

    useEffect(() => {
        // TODO:
        // chỉ là tạm thôi nhớ đổi lại
        if (globalState.client.islogin()) {
            setLogin(true);
        }
    }, []);

    return (
        <header className={cx('wrapper')}>
            <div className={cx('left')}>
                <div className={cx('icon')}>
                    <img src={images.logo} alt="logo" />
                </div>
                {left}
            </div>
            <div className={cx('center')}>{center}</div>
            <div className={cx('right')}>
                {right}
                <div className={cx('activity')}>
                    <DropDownButton icon={faDiscord} onClick={openDiscord} className={cx('item')} />
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
                            {islogin ? (
                                <>
                                    <div className={cx('user-info')}></div>
                                    <div className={cx('line', 'change-password')}></div>
                                </>
                            ) : (
                                <>
                                    <div className={cx('line')}>
                                        <Link to={routers.logInUp}>Đăng nhập</Link>
                                    </div>
                                    <div className={cx('line')}>
                                        <Link to={routers.logInUp + '?up=t'}>Đăng ký</Link>
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
