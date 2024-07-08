import {
    faAt,
    faEnvelopeCircleCheck,
    faLock,
    faUser,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import classNames from 'classnames/bind';
import { useContext, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Client } from '../../Service';
import ButtonWithLoading from '../../components/ButtonWithLoading';
import Input from '../../components/Input';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import { apiConfig, routerConfig } from '../../config';
import api from '../../config/api';
import { globalContent } from '../../store/GlobalContent';
import style from './LoginUp.module.scss';

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

function SignIn() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [globalState, setGlobalState] = useContext(globalContent);

    const navigate = useNavigate();

    const [err, setErr] = useState('');
    const [isLoading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);

        axios
            .post<loginResp>(api.baseUrl + apiConfig.logIn(), {
                userName: userName,
                password: password,
            })
            .then((resp) => {
                setLoading(false);
                console.log(resp);
                if (resp.data.success && resp.data.data) {
                    var data = resp.data.data;
                    console.log(data);

                    window.localStorage.setItem('token', data.accessToken);
                    setGlobalState((e) => {
                        e.client = new Client(data.accessToken);
                        return { ...e };
                    });

                    navigate(routerConfig.tkbs);

                    return;
                }

                setErr(resp.data.msg || '');
            })
            .catch((e) => {
                notifyMaster.error(String(e));
            });
    };

    return (
        <>
            {err ? (
                <div className={cx('err')}>
                    <p>{err}</p>
                    <FontAwesomeIcon icon={faXmark} onClick={() => setErr('')} />
                </div>
            ) : (
                ''
            )}
            <Input
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                title="User Name :"
                type="text"
                placeholder="Your name"
                icon={faUser}
            />
            <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                title="Password :"
                type="password"
                placeholder="Password"
                icon={faLock}
            />
            <a href={routerConfig.forgotPassword}>quên mật khẩu ?</a>
            <ButtonWithLoading className={cx('btn')} onClick={handleLogin} isLoading={isLoading}>
                SignIn
            </ButtonWithLoading>
        </>
    );
}

function SignUp() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const [err, setErr] = useState('');
    const [isLoading, setLoading] = useState(false);

    const signUpHandle = () => {
        setLoading(true);

        axios
            .post<logupResp>(api.baseUrl + '/auth/signup', {
                username: userName,
                password: password,
                email: email,
                type_signup: null,
            })
            .then((resp) => {
                setLoading(false);
                if (resp.data.success) {
                    var url = new URLSearchParams([
                        ['verifyEmail', 'true'],
                        ['msg', resp.data.msg],
                    ]).toString();
                    navigate('?' + url);

                    return;
                }

                setErr(resp.data.msg);
            })
            .catch((e) => {
                notifyMaster.error(String(e));
            });
    };

    return (
        <>
            {err ? (
                <div className={cx('err')}>
                    <p>{err}</p>
                    <FontAwesomeIcon icon={faXmark} onClick={() => setErr('')} />
                </div>
            ) : (
                ''
            )}
            <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                title="User Name :"
                type="text"
                placeholder="Your name"
                icon={faUser}
            />
            <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                title="Email :"
                type="text"
                placeholder="Email"
                icon={faAt}
            />
            <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                title="Password :"
                type="password"
                placeholder="Password"
                icon={faLock}
            />
            <ButtonWithLoading className={cx('btn')} isLoading={isLoading} onClick={signUpHandle}>
                SignUp
            </ButtonWithLoading>
        </>
    );
}

function LoginUp() {
    let [searchParams, setSearchParams] = useSearchParams();
    const [inORup, setInOrUp] = useState(!searchParams.get('up'));

    console.log(searchParams);

    if (searchParams.get('verifyEmail')) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('content', 'verify-email')}>
                    <FontAwesomeIcon icon={faEnvelopeCircleCheck} size="10x" />
                    <h2>Đăng ký thành công!</h2>
                    <p>{searchParams.get('msg')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('header')}>
                    <label>
                        <input
                            type="radio"
                            name="type"
                            checked={inORup}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    setInOrUp(true);
                                    setSearchParams((e) => {
                                        e.delete('up');
                                        return e;
                                    });
                                }
                            }}
                        />
                        <span className={cx('logo')}>Login</span>
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="type"
                            checked={!inORup}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    setInOrUp(false);
                                    setSearchParams((e) => {
                                        e.set('up', 't');
                                        return e;
                                    });
                                }
                            }}
                        />
                        <span className={cx('logo')}>LogUp</span>
                    </label>

                    <div className={cx('selection')}></div>
                </div>
                <div className={cx('line')}></div>
                <div
                    className={cx('input', {
                        isin: inORup,
                    })}
                >
                    <div className={cx('in', 'card')}>
                        <SignIn />
                    </div>
                    <div className={cx('up', 'card')}>
                        <SignUp />
                    </div>
                </div>

                <div className={cx('or')}>OR</div>

                <div className={cx('with')}>
                    <ButtonWithLoading className={cx('btn')} withoutBackground>
                        GitHub
                    </ButtonWithLoading>
                    <ButtonWithLoading className={cx('btn')} withoutBackground>
                        Google
                    </ButtonWithLoading>
                </div>
            </div>
        </div>
    );
}

export default LoginUp;
