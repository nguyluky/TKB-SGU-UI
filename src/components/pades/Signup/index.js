import { useContext, useState } from 'react';

import './Signup.scss';

import { useNavigate, Link, useSearchParams } from 'react-router-dom';

import './Signup.scss';
import TkbSguApi, { UserApi } from '~/api/Api';
import Context from '~/store/Context';

function Signup({ isSignIn }) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');

    let [searchParams, setSearchParams] = useSearchParams();
    var errPar = searchParams.get('err');

    const navigate = useNavigate();

    const [err, setErr] = useState('');

    const [isShowPass, setShow] = useState(false);

    const [state, dispath] = useContext(Context);

    const signUpHandle = () => {
        console.log(userName, password, email);

        if (password !== password2) {
            setErr('Mật khẩu không hớp');
            return;
        }

        TkbSguApi.signup(userName, password, email, null).then((e) => {
            if (e.success) {
                setSearchParams({ err: 'ok' });
                return;
            }

            setErr(e.msg + ' - ' + e.code);
        });
    };

    const signInHandle = () => {
        TkbSguApi.login(userName, password)
            .then((result) => {
                if (result instanceof UserApi) {
                    dispath({ type: 'SET-USER', value: result });
                    var last = window.sessionStorage.getItem('last');
                    if (last) navigate(last);
                    else navigate('/');
                } else {
                    setErr(result.msg);
                }
            })
            .catch((err) => {});
    };

    return (
        <div className="sign-up-wall">
            <div className="sign-up-content">
                <div className={isSignIn ? 'input signin' : 'input signup'}>
                    <div className="conten">
                        <div className="input-Sign-up">
                            <h1 className="title">SignUp</h1>
                            <div className="line">
                                <span>
                                    <box-icon name="user" type="solid"></box-icon>
                                </span>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Tên đăng nhập"
                                />
                            </div>
                            <div className="line">
                                <span>
                                    <box-icon name="envelope" type="solid"></box-icon>
                                </span>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Tên đăng nhập"
                                />
                            </div>
                            <div className="line">
                                <span>
                                    <box-icon name="lock-alt" type="solid"></box-icon>
                                </span>
                                <input
                                    type={isShowPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mật khẩu"
                                />
                                <span onClick={() => setShow(!isShowPass)}>
                                    <box-icon name={isShowPass ? 'show' : 'hide'}></box-icon>
                                </span>
                            </div>
                            <div className="line">
                                <span>
                                    <box-icon name="lock-alt" type="solid"></box-icon>
                                </span>
                                <input
                                    type={isShowPass ? 'text' : 'password'}
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                    placeholder="Xác nhật mật khẩu"
                                />
                                <span onClick={() => setShow(!isShowPass)}>
                                    <box-icon name={isShowPass ? 'show' : 'hide'}></box-icon>
                                </span>
                            </div>
                            <div className="err">{err ? <p>{err}</p> : ''}</div>
                            <button className="ok" onClick={signUpHandle}>
                                SignUp
                            </button>
                            <p className="dctk">
                                Đã có tài khoản?<Link to="/sign_in">SignIn</Link>
                            </p>
                        </div>
                        <div className="input-Sign-in">
                            <h1 className="title">SignIn</h1>
                            <div className="line">
                                <span>
                                    <box-icon name="user" type="solid"></box-icon>
                                </span>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Tên đăng nhập"
                                />
                            </div>
                            <div className="line">
                                <span>
                                    <box-icon name="lock-alt" type="solid"></box-icon>
                                </span>
                                <input
                                    type={isShowPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mật khẩu"
                                />
                                <span onClick={() => setShow(!isShowPass)}>
                                    <box-icon name={isShowPass ? 'show' : 'hide'}></box-icon>
                                </span>
                            </div>
                            <div className="err">{err ? <p>{err}</p> : ''}</div>
                            <Link className="dctk" to="/sign_in/forget_password">
                                Quên mật khẩu?
                            </Link>
                            <button className="ok" onClick={signInHandle}>
                                SignIn
                            </button>
                            <p className="dctk">
                                Không có tài khoản?<Link to="/sign_up">SignUp</Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="or">
                    <div className="vr" />
                    <p>OR</p>
                    <div className="vr" />
                </div>

                <button className="fb"> with facebook</button>

                <button className="gg">Lognin with google</button>
            </div>
        </div>
    );
}

export default Signup;
