import React from 'react';

import Tippy from '@tippyjs/react';
import { useNavigate } from 'react-router-dom';

import './TopBar.scss';
import 'boxicons';

import images from '~/assets/images';
import UserInfo from './UserInfo';

import storeContext from '~/store/Context';

function TopBar({ children }) {
    const [state, dispath] = React.useContext(storeContext);

    const [isAccShow, setAccShow] = React.useState(false);

    const navigate = useNavigate();

    const themeHandle = () => {
        if (!state.theme) {
            dispath({ type: 'THEME-SET-DARK' });
        } else {
            dispath({ type: 'THEME-SET-LIGHT' });
        }
    };

    const githubHandle = () => {
        window.open('https://github.com/nguyluky/TKB-SGU-UI');
    };

    const accountHandleShow = () => {
        if (!state.user) {
            sessionStorage.setItem('last', window.location.pathname);
            navigate('/sign_in');
        }
        setAccShow(true);
    };

    const accountHandleHide = () => {
        setAccShow(false);
    };

    return (
        <div className="topbar">
            <div className="leftside">
                <div className="logo">
                    <img src={images.logo} alt="logo" />
                </div>
                <div className="tools">{children}</div>
            </div>
            <div className="rightside">
                <div className="bgithub" onClick={githubHandle}>
                    <box-icon type="logo" name="github"></box-icon>
                </div>
                <div className="theme-toggle" onClick={themeHandle}>
                    {state.theme ? <box-icon name="sun" /> : <box-icon name="moon" />}
                </div>
                <Tippy content={<UserInfo />} trigger="click">
                    <div className="account" onClick={isAccShow ? accountHandleHide : accountHandleShow}>
                        {state.user ? <box-icon name="user"></box-icon> : <p className="btt-sign-in">login</p>}
                    </div>
                </Tippy>
            </div>
        </div>
    );
}

export default TopBar;
