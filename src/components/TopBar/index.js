import React from 'react';
import './TopBar.scss';
import 'boxicons';
import images from '~/assets/images';
import Tippy from '@tippyjs/react';
import UserInfo from './UserInfo';

function TopBar({ children }) {
    const [darkMode, setDarkMode] = React.useState(false);
    const [isAccShow, setAccShow] = React.useState(false);

    const themeHandle = () => {
        document.body.className = !darkMode ? 'dark-mode' : '';
        setDarkMode(!darkMode);
    };

    const githubHandle = () => {
        window.open('http://github.com/');
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
                    {darkMode ? <box-icon name="sun" /> : <box-icon name="moon" />}
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
