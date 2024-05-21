import { useContext, useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import './Signin.scss';
import TkbSguApi, { UserApi } from '~/api/Api';
import Context from '~/store/Context';

function Signin() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const [err, setErr] = useState('');

    // const [isLoading, setLoading] = useState(false);
    const [isShowPass, setShow] = useState(false);

    const navigate = useNavigate();

    // eslint-disable-next-line no-unused-vars
    const [state, dispath] = useContext(Context);

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
                <h1 className="title">SignIn</h1>
                <div className="line">
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Tên đăng nhập"
                    />
                </div>
                <div className="line">
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

export default Signin;
