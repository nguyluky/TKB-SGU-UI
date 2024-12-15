import classNames from 'classnames/bind';
import { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { headerContent } from '../../components/Layout/DefaultLayout';
import Background from '../components/Background';
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
    const setHeader = useContext(headerContent);

    const [searchParams] = useSearchParams();
    const nav = useNavigate();

    msg = msg || searchParams.get('msg') || "We can't seem to find the page you're looking for.";
    code = code || parseInt(searchParams.get('code') || '404');

    icon = icon || searchParams.get('icon') || '';

    // const iconJsx = icons[icon] || icons['pageNotFound'];

    useEffect(() => {
        if (setHeader)
            setHeader((e) => {
                e.left = (
                    <p
                        style={{
                            marginLeft: '5px',
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                        }}
                    >
                        Error {code}
                    </p>
                );
                return { ...e };
            });
    }, [code, setHeader]);

    return (
        <Background>
            <div className={cx('wrapper')}>
                <div className={cx('error-container')}>
                    <div className={cx('error-code')}>{code}</div>
                    <div className={cx('error-msg')}>{msg}</div>
                    <div className={cx('error-btn')} onClick={() => nav('/')}>
                        Go back Home
                    </div>
                </div>
            </div>
        </Background>
    );
}

export default Error;
