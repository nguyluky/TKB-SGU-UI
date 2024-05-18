import React from 'react';
import './TopBar.scss';
import 'boxicons';
import images from '~/assets/images';
import Tippy from '@tippyjs/react';
import UserInfo from './UserInfo';

import storeContext from '~/store/Context';

function TopBar({ children }) {
    const [state, dispath] = React.useContext(storeContext);

    console.log(state);

    // const [darkMode, setDarkMode] = React.useState(() => {
    //     if (!localStorage.getItem('theme')) {
    //         document.body.className =
    //             window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : '';
    //         return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    //     }
    //     return localStorage.getItem('theme') == 'dark';
    // });
    const [isAccShow, setAccShow] = React.useState(false);

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
        setAccShow(true);
    };

    const accountHandleHide = () => {
        setAccShow(false);
    };

    return (
        <div className="topbar">
            <div className="leftside">
                <div className="logo">
                    <img src={images.logo} />
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
                        <box-icon name="user"></box-icon>
                    </div>
                </Tippy>
            </div>
        </div>
    );
}

export default TopBar;
