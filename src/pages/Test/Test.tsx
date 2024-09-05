/* eslint-disable @typescript-eslint/no-unused-vars */
import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import { globalContent } from '../../store/GlobalContent';
import style from './Test.module.scss';

const cx = classNames.bind(style);

function Test() {
    const [tab, setTab] = useState<number>(0);
    const [open, setopne] = useState(true);
    const [globalState] = useContext(globalContent);

    return (
        <div>
            <button
                onClick={() => {
                    window.addEventListener('message', (e) => {
                        console.log(e);
                    });
                    const win = window.open(
                        'http://localhost:4000/api/v2/auth/google_calendar?tkbId=1&access_token=' +
                            encodeURI(globalState.client.token || ''),
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
