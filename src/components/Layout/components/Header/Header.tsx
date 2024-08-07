import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faBug, faGear, faLock, faMoon, faSun, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNamesBind from 'classnames/bind';
import { ChangeEvent, ReactElement, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

import images from '../../../../assets/images';
import { apiConfig, routerConfig } from '../../../../config';
import { ApiResponse, Client } from '../../../../Service';
import { globalContent } from '../../../../store/GlobalContent';
import DropDownButton from '../../../DropDownButton/DropDownButton';
import Input from '../../../Input';
import { NotifyMaster } from '../../../NotifyPopup';
import PopupModel from '../../../PopupModel';
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

    const [p1, setP1] = useState<string>('');
    const [p2, setP2] = useState<string>('');
    const [p3, setP3] = useState<string>('');

    const openGitHub = () => {
        window.open('https://github.com/nguyluky/TKB-SGU-UI');
    };

    const openIssues = () => {
        window.open('https://github.com/nguyluky/TKB-SGU-UI/issues');
    };

    const openDiscord = () => {
        window.open('https://discord.gg/gVdV6UJRvy');
    };

    const handelChangeTheme = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked && globalState && setGlobalState) {
            globalState.theme = event.target.value;
            window.localStorage.setItem('theme', event.target.value);
            setGlobalState({ ...globalState });
        }
    };

    const onChangePasswordHandel = () => {
        if (p2 !== p3) {
            NotifyMaster.error('Xác nhận mật khẩu không đúng');
            return;
        }
        console.log(p1, p2);
        if (globalState.client.islogin())
            globalState.client.request
                .post<ApiResponse<null>>(apiConfig.baseUrl + '/auth/change-password', {
                    password: p2,
                    oldpassword: p1,
                })
                .then((resp) => {
                    if (resp.data.success) {
                        NotifyMaster.success('Đổi mật khẩu thành công');
                        return;
                    }

                    NotifyMaster.error(resp.data.msg);
                });
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
                                    <Popup
                                        onOpen={() => {
                                            setP1('');
                                            setP2('');
                                            setP3('');
                                        }}
                                        trigger={
                                            <div className={cx('line', 'change-password')}>
                                                Đổi mật khẩu
                                            </div>
                                        }
                                        modal
                                    >
                                        <PopupModel
                                            title="Đổi mật khẩu"
                                            onOk={onChangePasswordHandel}
                                        >
                                            <Input
                                                className={cx('line-p')}
                                                autoComplete="off"
                                                title="Mật khẩu hiện tại"
                                                type="password"
                                                icon={faUser}
                                                value={p1}
                                                onChange={(e) => setP1(e.target.value)}
                                            />
                                            <Input
                                                autoComplete="off"
                                                title="Mật khẩu mới"
                                                type="password"
                                                icon={faLock}
                                                className={cx('line-p')}
                                                value={p2}
                                                onChange={(e) => setP2(e.target.value)}
                                            />
                                            <Input
                                                autoComplete="off"
                                                title="Xác nhận mật khẩu"
                                                type="password"
                                                icon={faLock}
                                                className={cx('line-p')}
                                                value={p3}
                                                onChange={(e) => setP3(e.target.value)}
                                            />
                                        </PopupModel>
                                    </Popup>

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
