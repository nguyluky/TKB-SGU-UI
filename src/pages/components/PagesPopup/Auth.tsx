import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import classNames from 'classnames/bind';
import { forwardRef, useContext, useEffect, useLayoutEffect, useState } from 'react';
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

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    labelTitle: string;
    children?: React.ReactNode;
}

function CustomInput({ name, id, labelTitle, children, ...props }: CustomInputProps) {
    return (
        <div className={cx('input-group')}>
            <label htmlFor={name}>{labelTitle}</label>
            <input name={name} id={id} {...props} />
            {children}
        </div>
    );
}

interface AuthProps extends Omit<PopupProps, 'children' | 'open' | 'onClose'> {
    onForgotPassword: () => void;
}

export interface AuthRef {
    openLogin: () => void;
    openRegistrastion: () => void;
    close: () => void;
}

function Auth_({ ...pros }: AuthProps, ref: React.ForwardedRef<AuthRef>) {
    const [globalState, setGlobalState] = useContext(globalContent);
    const [params, setParams] = useSearchParams();

    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const [errType, setErrType] = useState<string>('');
    const [mess, setMess] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState([false, false]);

    const [height, setHeight] = useState(0);

    const [loginHeight, setLoginHeight] = useState(0);
    const [registrationHeight, setRegistrationHeight] = useState(0);

    const onClose = () => {
        setParams((e) => {
            e.delete('login');
            e.delete('registration');

            return e;
        });
    };

    const popupWindow = useWindowPopup((event) => {
        console.log(event);
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

            popupWindow.close();
        } else if (t === 'notify') {
            const data = event.data;
            notifyMaster[data.data.notifyType](data.data.mess);
            popupWindow.close();
        }
        onClose();
    });

    useEffect(() => {
        // MutableRefObject

        const openLogin = () => {
            setParams((e) => {
                const a: { [key: string]: string } = {};
                e.forEach((v, k) => {
                    a[k] = v;
                });

                return { ...a, login: '1' };
            });
        };

        const openRegistrastion = () => {
            setParams((e) => {
                const a: { [key: string]: string } = {};
                e.forEach((v, k) => {
                    a[k] = v;
                });

                return { ...a, registration: '1' };
            });
        };

        const close_ = () => {
            setParams((e) => {
                e.delete('login');
                e.delete('registration');

                return e;
            });
        };

        if (ref && typeof ref === 'function') {
            ref({
                openLogin: openLogin,
                openRegistrastion: openRegistrastion,
                close: close_,
            });
        } else if (ref) {
            ref.current = {
                openLogin: openLogin,
                openRegistrastion: openRegistrastion,
                close: close_,
            };
        }
    }, [ref, setParams]);

    useLayoutEffect(() => {
        if (params.get('login')) {
            setHeight(loginHeight);
        } else if (params.get('registration')) {
            setHeight(registrationHeight);
        }
    }, [loginHeight, params, registrationHeight]);

    const changeToRegistration = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setPassword('');
        setUserName('');
        setParams((e) => {
            const a: { [key: string]: string } = {};
            e.forEach((v, k) => {
                if (k === 'login') return;
                a[k] = v;
            });

            return { ...a, registration: '1' };
        });
    };

    const changeToLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setPassword('');
        setUserName('');
        setEmail('');
        setParams((e) => {
            const a: { [key: string]: string } = {};
            e.forEach((v, k) => {
                if (k === 'registration') return;
                a[k] = v;
            });

            return { ...a, login: '1' };
        });
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

                    onClose();

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

        if (userName.length > 30) {
            setErrType('username');
            setMess('Mật khẩu tối đa 30 kí tự!');
            return;
        }

        if (
            email.match(
                // eslint-disable-next-line no-useless-escape
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ) == null
        ) {
            setErrType('email');
            setMess('Email Không hợp lệ!');
            return;
        }

        setIsLoading(true);

        axios
            .post<logupResp>(apiConfig.logUp(), {
                userName: userName,
                password: password,
                email: email,
            })
            .then((resp) => {
                setIsLoading(false);
                if (resp.data.success) {
                    notifyMaster.success('Đăng ký thành công, vui lòng kiểm tra email để xác nhận tài khoản');
                    setParams((e) => {
                        e.delete('registration');
                        return e;
                    });
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

    // useEffect(() => {
    //     setShowPassword([false, false]);

    // }, [JSON.stringify([params.get('login'), params.get('registration')])]);

    return (
        <Popup {...pros} open={!!(params.get('login') || params.get('registration'))} onClose={onClose}>
            <div
                className={cx('wrapper', {
                    registration: params.get('registration'),
                })}
                style={{
                    height: height,
                }}
            >
                <div className={cx('form-container', 'login')} ref={(e) => setLoginHeight(e?.clientHeight || 0)}>
                    <p className={cx('title')}>Login</p>
                    <form className={cx('form')} onSubmit={onLoginSubmit}>
                        <CustomInput
                            name="username & email"
                            labelTitle="Username & Email"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        >
                            <div className={cx('err')}>{errType === 'login-pass' ? mess : ''}</div>
                        </CustomInput>
                        <CustomInput
                            name="password"
                            labelTitle="Password"
                            value={password}
                            type={showPassword[0] ? 'text' : 'password'}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                            <div className={cx('err')}>{errType === 'login-pass' ? mess : ''}</div>
                        </CustomInput>

                        <div className={cx('show-password')}>
                            <input
                                type="checkbox"
                                name=""
                                id=""
                                checked={showPassword[0]}
                                onChange={(e) => {
                                    setShowPassword([e.target.checked, showPassword[1]]);
                                }}
                            />
                            <label htmlFor="">Show password</label>
                        </div>

                        <ButtonWithLoading isLoading={isLoading} className={cx('sign')}>
                            Sign in
                        </ButtonWithLoading>
                    </form>
                    <div className={cx('forgot')}>
                        <p rel="noopener noreferrer" onClick={pros.onForgotPassword}>
                            Forgot Password ?
                        </p>
                    </div>
                    <div className={cx('social-message')}>
                        <div className={cx('line')} />
                        <p className={cx('message')}>OR</p>
                        <div className={cx('line')} />
                    </div>
                    <div className={cx('social-icons')}>
                        <button aria-label="Log in with Google" className={cx('icon')} onClick={googleOauth}>
                            <FontAwesomeIcon icon={faGoogle} />
                        </button>
                        <button aria-label="Log in with GitHub" className={cx('icon')}>
                            <FontAwesomeIcon icon={faGithub} />
                        </button>
                    </div>
                    <p className={cx('signup')}>
                        Don't have an account?
                        <a rel="noopener noreferrer" href="/" className={cx('')} onClick={changeToRegistration}>
                            Sign up
                        </a>
                    </p>
                </div>
                <div
                    className={cx('form-container', 'registration')}
                    ref={(e) => setRegistrationHeight(e?.clientHeight || 0)}
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
                            type={showPassword[1] ? 'text' : 'password'}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                            <div className={cx('err')}></div>
                        </CustomInput>

                        <div className={cx('show-password')}>
                            <input
                                type="checkbox"
                                name=""
                                checked={showPassword[1]}
                                onChange={(e) => {
                                    setShowPassword([showPassword[0], e.target.checked]);
                                }}
                            />
                            <label>Show password</label>
                        </div>

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
                        <button aria-label="Log in with Google" className={cx('icon')} onClick={googleOauth}>
                            <FontAwesomeIcon icon={faGoogle} />
                        </button>
                        <button aria-label="Log in with GitHub" className={cx('icon')}>
                            <FontAwesomeIcon icon={faGithub} />
                        </button>
                    </div>
                    <p className={cx('signup')}>
                        Already have account
                        <a rel="noopener noreferrer" href="/" className={cx('')} onClick={changeToLogin}>
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </Popup>
    );
}

const Auth = forwardRef<AuthRef, AuthProps>(Auth_);

export default Auth;
