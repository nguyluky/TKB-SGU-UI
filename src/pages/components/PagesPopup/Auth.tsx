import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { PopupProps } from 'reactjs-popup/dist/types';

import ButtonWithLoading from '../../../components/ButtonWithLoading';
import notifyMaster from '../../../components/NotifyPopup/NotificationManager';
import { apiConfig } from '../../../config';
import useWindowPopup from '../../../Hooks/useWindowPopup';
import { Client } from '../../../Service';
import { globalContent } from '../../../store/GlobalContent';

import style from './Auth.module.scss';

const cx = classNames.bind(style);

interface loginResp {
    code: number;
    msg: string;
    success: boolean;
    data?: {
        accessToken: string;
        token_type: string;
    } | null;
}

interface logupResp {
    code: number;
    msg: string;
    success: boolean;
    data?: null;
}

interface AuthProps extends Omit<PopupProps, 'children'> {
    onForgotPassword: () => void;
}

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    labelTitle: string;
    children?: React.ReactNode;
}

function CustomInput({ name, id, labelTitle, children, ...props }: CustomInputProps) {
    return (
        <div className={cx('input-group')}>
            <label htmlFor={name}>{labelTitle}</label>
            <input type="text" name={name} id={id} {...props} />
            {children}
        </div>
    );
}

export default function Auth(pros: AuthProps) {
    const [globalState, setGlobalState] = useContext(globalContent);
    const [params, setParams] = useSearchParams();

    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [height, setHeight] = useState<number>(0);
    const popupWindow = useWindowPopup((event: MessageEvent) => {
        const t = event.data.type;
        if (t === 'googleOauth2') {
            const accessToken = event.data.data;
            window.localStorage.setItem('token', accessToken);
            const client = new Client(accessToken);

            client.getUserInfo().then((resp) => {
                if (resp.success) globalState.userInfo = resp.data;

                globalState.client = client;
                setGlobalState({ ...globalState });
            });

            pros.onClose && pros.onClose();
            popupWindow.close();
        } else if (t === 'notify') {
            const data = event.data as {
                type: string;
                notifyType: 'success' | 'error';
                data: string;
            };

            if (data.notifyType in notifyMaster) {
                notifyMaster[data.notifyType](data.data);
            }
            popupWindow.close();
        }
    });

    const [errType, setErrType] = useState<string>('');
    const [mess, setMess] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [dk, setDk] = useState(false);

    const changeToRegistration = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setPassword('');
        setUserName('');
        setParams({
            registration: '1',
        });
    };

    const changeToLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setPassword('');
        setUserName('');
        setParams({});
        setEmail('');
    };

    const onLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setErrType('');
        setMess('');
        axios
            .post<loginResp>(apiConfig.baseUrl + apiConfig.logIn(), {
                userName: userName,
                password: password,
            })
            .then((resp) => {
                setIsLoading(false);
                console.log(resp);
                if (resp.data.success && resp.data.data) {
                    const data = resp.data.data;
                    console.log(data);

                    window.localStorage.setItem('token', data.accessToken);
                    const client = new Client(data.accessToken);

                    client.getUserInfo().then((resp) => {
                        if (resp.success) globalState.userInfo = resp.data;

                        globalState.client = client;
                        setGlobalState({ ...globalState });
                    });

                    pros.onClose && pros.onClose();

                    return;
                }
                // notifyMaster.error(resp.data.msg || '', undefined, -1);
                setErrType('login-pass');
                setMess(resp.data.msg || '');
                console.log(resp.data);
            })
            .catch((e) => {
                console.log(e);
                // notifyMaster.error(String(e));
            });
    };

    const onRegistration = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrType('');
        setMess('');

        if (userName.length < 5) {
            setErrType('username');
            setMess('Tên đăng nhập tối thiểu 5 kí tự!');
            return;
        }

        if (
            email.match(
                // eslint-disable-next-line no-useless-escape
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            ) == null
        ) {
            setErrType('email');
            setMess('Email Không hợp lệ!');
            return;
        }

        setIsLoading(true);

        axios
            .post<logupResp>(apiConfig.baseUrl + '/auth/signup', {
                username: userName,
                password: password,
                email: email,
                type_signup: null,
            })
            .then((resp) => {
                setIsLoading(false);
                if (resp.data.success) {
                    setDk(true);
                }

                setErrType('email');
                setMess(resp.data.msg);
                // notifyMaster.error(resp.data.msg, undefined, -1);
                // setErr(resp.data.msg);
            })
            .catch((e) => {
                // notifyMaster.error(String(e));
                console.log(e);
            });
    };

    const googleOauth = () => {
        popupWindow.open({
            url: apiConfig.baseUrl + apiConfig.googleOauth(),
            title: 'login google',
            h: 700,
            w: 700,
        });
    };

    return (
        <Popup {...pros}>
            <div
                className={cx('wrapper', {
                    registration: params.get('registration'),
                })}
                style={{
                    height: height,
                }}
            >
                {dk ? (
                    <div className={cx('check-email')}>
                        <div className={cx('check-icon')}>
                            <FontAwesomeIcon icon={faEnvelopeCircleCheck} size={'6x'} />
                        </div>
                        <h1>Xác nhận Email</h1>
                        <span className={cx('info')}>
                            Bạn đã nhập <strong>{email}</strong> là đại chỉ email cho tài khoản của
                            bạn cần xác nhận email bạn.
                        </span>

                        <button
                            className={cx('sign')}
                            onClick={(e) => {
                                window.open('http://gmail.com/');
                            }}
                        >
                            Go to Gmail
                        </button>
                        <button className={cx('sign', 'bt')} onClick={(e) => setDk(false)}>
                            back
                        </button>
                    </div>
                ) : (
                    ''
                )}
                <div
                    className={cx('form-container', 'login')}
                    ref={(e) => {
                        if (!params.get('registration')) {
                            setHeight(e?.clientHeight || 0);
                        }
                    }}
                >
                    <p className={cx('title')}>Login</p>
                    <form className={cx('form')} onSubmit={onLoginSubmit}>
                        <CustomInput
                            name="username"
                            labelTitle="Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        >
                            <div className={cx('err')}>{errType === 'login-pass' ? mess : ''}</div>
                        </CustomInput>
                        <CustomInput
                            name="password"
                            labelTitle="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                            <div className={cx('err')}>{errType === 'login-pass' ? mess : ''}</div>
                        </CustomInput>
                        <ButtonWithLoading isLoading={isLoading} className={cx('sign')}>
                            Sign in
                        </ButtonWithLoading>
                        {/* <button className={cx('sign')}>Sign in</button> */}
                    </form>
                    <div className={cx('forgot')}>
                        <a rel="noopener noreferrer" href="/">
                            Forgot Password ?
                        </a>
                    </div>
                    <div className={cx('social-message')}>
                        <div className={cx('line')} />
                        <p className={cx('message')}>OR</p>
                        <div className={cx('line')} />
                    </div>
                    <div className={cx('social-icons')}>
                        <button
                            aria-label="Log in with Google"
                            className={cx('icon')}
                            onClick={googleOauth}
                        >
                            <FontAwesomeIcon icon={faGoogle} />
                        </button>
                        <button aria-label="Log in with GitHub" className={cx('icon')}>
                            <FontAwesomeIcon icon={faGithub} />
                        </button>
                    </div>
                    <p className={cx('signup')}>
                        Don't have an account?
                        <a
                            rel="noopener noreferrer"
                            href="/"
                            className={cx('')}
                            onClick={changeToRegistration}
                        >
                            Sign up
                        </a>
                    </p>
                </div>
                <div
                    className={cx('form-container', 'registration')}
                    ref={(e) => {
                        if (params.get('registration')) {
                            setHeight(e?.clientHeight || 0);
                        }
                    }}
                >
                    <p className={cx('title')}>Sign up</p>
                    <form className={cx('form')} onSubmit={onRegistration}>
                        <CustomInput
                            labelTitle="Username"
                            name="username-registration"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        >
                            <div className={cx('err')}>{errType === 'username' ? mess : ''}</div>
                        </CustomInput>
                        <CustomInput
                            name="email"
                            labelTitle="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                            <div className={cx('err')}>{errType === 'email' ? mess : ''}</div>
                        </CustomInput>
                        <CustomInput
                            labelTitle="Password"
                            name="password-registration"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                            <div className={cx('err')}></div>
                        </CustomInput>

                        <ButtonWithLoading isLoading={isLoading} className={cx('sign')}>
                            Sign up
                        </ButtonWithLoading>
                    </form>
                    <div className={cx('social-message')}>
                        <div className={cx('line')} />
                        <p className={cx('message')}>OR</p>
                        <div className={cx('line')} />
                    </div>
                    <div className={cx('social-icons')}>
                        <button aria-label="Log in with Google" className={cx('icon')}>
                            <FontAwesomeIcon icon={faGoogle} />
                        </button>
                        <button aria-label="Log in with GitHub" className={cx('icon')}>
                            <FontAwesomeIcon icon={faGithub} />
                        </button>
                    </div>
                    <p className={cx('signup')}>
                        Already have account
                        <a
                            rel="noopener noreferrer"
                            href="/"
                            className={cx('')}
                            onClick={changeToLogin}
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </Popup>
    );
}
