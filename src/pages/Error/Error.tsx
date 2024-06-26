import classNames from 'classnames/bind';

import { useNavigate, useSearchParams } from 'react-router-dom';
import style from './Error.module.scss';

const cx = classNames.bind(style);

const icons: { [Key: string]: JSX.Element } = {
    pageNotFound: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-file-x-2"
        >
            <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="m8 12.5-5 5" />
            <path d="m3 12.5 5 5" />
        </svg>
    ),

    emailTimeOut: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-mail-x"
        >
            <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            <path d="m17 17 4 4" />
            <path d="m21 17-4 4" />
        </svg>
    ),
    serverError: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-server-off"
        >
            <path d="M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5" />
            <path d="M10 10 2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2h6z" />
            <path d="M22 17v-1a2 2 0 0 0-2-2h-1" />
            <path d="M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5.5.5-8-8H4z" />
            <path d="M6 18h.01" />
            <path d="m2 2 20 20" />
        </svg>
    ),
};

function Error({ msg, code, icon }: { msg?: string; code?: number; icon?: string }) {
    const [searchParams] = useSearchParams();
    const nav = useNavigate();

    msg = msg || searchParams.get('msg') || "We can't seem to find the page you're looking for.";
    code = code || parseInt(searchParams.get('code') || '404');

    icon = icon || searchParams.get('icon') || '';

    const iconJsx = icons[icon] || icons['pageNotFound'];

    return (
        <div className={cx('wrapper')}>
            <div className={cx('context')}>
                <div className={cx('icon')}>{iconJsx}</div>
                <div className={cx('info')}>
                    <h1 className={cx('code')}>{code}</h1>
                    <p className={cx('msg')}>{msg}</p>
                    <div className={cx('button')}>
                        <button onClick={() => nav('/')}>Go Home Page</button>
                        <button
                            className={cx('nbg')}
                            onClick={() =>
                                window.open('https://github.com/nguyluky/TKB-SGU-UI/issues')
                            }
                        >
                            Report
                        </button>
                    </div>
                </div>
            </div>
            <div className={cx('area')}>
                <ul className={cx('circles')}>
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                </ul>
            </div>
        </div>
    );
}

export default Error;
