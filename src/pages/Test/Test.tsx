/* eslint-disable @typescript-eslint/no-unused-vars */
import classNames from 'classnames/bind';
import { useState } from 'react';
import Auth from '../components/PagesPopup/Auth';
import style from './Test.module.scss';

const cx = classNames.bind(style);

function Test() {
    const [tab, setTab] = useState<number>(0);
    const [open, setopne] = useState(true);
    return (
        <div>
            <button onClick={() => setopne(true)}>open</button>
            <Auth
                open={open}
                onClose={() => {
                    setopne(false);
                }}
                onForgotPassword={() => {}}
            />
            <p>hello</p>
        </div>
    );
}

export default Test;
