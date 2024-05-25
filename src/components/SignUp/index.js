import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TkbSguApi from '~/api/Api';

function SignUp() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [isShowPass, setShow] = useState(false);
    const [err, setErr] = useState('');

    const signUpHandle = () => {
        console.log(userName, password, email);

        if (password !== password2) {
            setErr('Mật khẩu không hớp');
            return;
        }

        TkbSguApi.signup(userName, password, email, null).then((e) => {
            if (e.success) {
                // setSearchParams({ err: 'ok' });
                return;
            }

            setErr(e.msg + ' - ' + e.code);
        });
    };
    return (
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
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
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
                Đã có tài khoản?
                <Link to="/auth/signin" unstable_viewTransition>
                    SignIn
                </Link>
            </p>
        </div>
    );
}

export default SignUp;
