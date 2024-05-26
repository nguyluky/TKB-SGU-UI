import React, { useEffect, useId, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import './TopBar.scss';
import 'boxicons';

import images from '~/assets/images';
import UserInfo from '~/components/UserInfo';

import storeContext from '~/store/GlobalStore/Context';
import { themes } from '~/components/GlobalStyles';

function TopBar({ left, right, center }) {
    const [state, dispath] = React.useContext(storeContext);

    const [isAccShow, setAccShow] = React.useState(false);
    const [isThemeShow, setThemeShow] = React.useState(false);

    const navigate = useNavigate();

    const refAcc = useRef(null);
    const refTheme = useRef(null);

    const radioThemeName = useId();

    const githubHandle = () => {
        window.open('https://github.com/nguyluky/TKB-SGU-UI');
    };

    const accountHandleShow = () => {
        if (!state.user?.token) {
            sessionStorage.setItem('last', window.location.pathname);
            navigate('/sign_in');
        }
        setAccShow(true);
    };

    const accountHandleHide = () => {
        console.log('ok');
        setAccShow(false);
    };

    useEffect(() => {
        function mousedownHandle(event) {
            if (refAcc.current && !refAcc.current.contains(event.target)) {
                setAccShow(false);
            }
            if (refTheme.current && !refTheme.current.contains(event.target)) {
                setThemeShow(false);
            }
        }

        document.addEventListener('mousedown', mousedownHandle);

        return () => {
            document.removeEventListener('mousedown', mousedownHandle);
        };
    }, [refAcc]);

    return (
        <div className="topbar">
            <div className="leftside">
                <div className="logo">
                    <img src={images.logo} alt="logo" />
                </div>
                <div className="tools">{left}</div>
            </div>
            <div className="centerside">{center}</div>
            <div className="rightside">
                {right}
                <div className="bgithub" onClick={githubHandle}>
                    <div className="icon">
                        <box-icon type="logo" name="github"></box-icon>
                    </div>
                </div>
                <div className="theme-toggle" ref={refTheme}>
                    <div className="icon" onClick={() => (isThemeShow ? setThemeShow(false) : setThemeShow(true))}>
                        <box-icon name="moon" />
                    </div>

                    {isThemeShow ? (
                        <div className="drop-down-wall">
                            <div className="themes">
                                {Object.keys(themes).map((key, i) => {
                                    return (
                                        <label className="line" key={i}>
                                            <input
                                                type="radio"
                                                name={radioThemeName}
                                                key={i}
                                                value={key}
                                                checked={state.theme === key}
                                                onChange={() => {
                                                    setThemeShow(false);
                                                    window.localStorage.setItem('theme', key);
                                                    dispath({ path: 'theme', value: key });
                                                }}
                                            />
                                            <span>{key}</span>
                                            {state.theme === key ? <box-icon name="check"></box-icon> : ''}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                </div>
                <div className="account" ref={refAcc}>
                    <div className="icon" onClick={isAccShow ? accountHandleHide : accountHandleShow}>
                        {state.user?.token ? <box-icon name="user"></box-icon> : <p className="btt-sign-in">login</p>}
                    </div>
                    {isAccShow ? (
                        <div className="drop-down-wall">
                            {' '}
                            <UserInfo onHide={accountHandleHide} />{' '}
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </div>
    );
}

export default TopBar;
