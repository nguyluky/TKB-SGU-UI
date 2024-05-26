import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TkbSguApi, { UserApi } from '~/api/Api';
import Context from '~/store/GlobalStore/Context';

function SignIn() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPass, setShow] = useState(false);
    const [err, setErr] = useState('');

    const [state, dispath] = useContext(Context);

    const navigate = useNavigate();

    const signInHandle = () => {
        TkbSguApi.login(userName, password)
            .then((result) => {
                if (result instanceof UserApi) {
                    state.user.token = result.token;
                    dispath({ path: 'user', value: state.user });
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
                Không có tài khoản?
                <Link to="/sign_up" unstable_viewTransition>
                    SignUp
                </Link>
            </p>
        </div>
    );
}

export default SignIn;
