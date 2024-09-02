/* eslint-disable @typescript-eslint/no-unused-vars */
import classNames from 'classnames/bind';
import { useState } from 'react';
import style from './Test.module.scss';

const cx = classNames.bind(style);

function Test() {
    const [tab, setTab] = useState<number>(0);
    const [open, setopne] = useState(true);
    return (
        <div>
            <button
                onClick={() => {
                    window.addEventListener('message', (e) => {
                        console.log(e);
                    });
                    const win = window.open(
                        'http://localhost:4000/test',
                        'login google',
                        'height=600,width=450',
                    );

                    if (win) {
                        win.focus();
                    }
                }}
            >
                login
            </button>
            <p>hello</p>
        </div>
    );
}

export default Test;
