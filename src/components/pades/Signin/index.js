import { useContext, useRef, useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import './Signin.scss';
import TkbSguApi, { UserApi } from '~/api/Api';
import Context from '~/store/Context';

function Signin() {
    const userNameRef = useRef(null);
    const passwordRef = useRef(null);

    const isLoading = useState(false);

    const navigate = useNavigate();

    const [state, dispath] = useContext(Context);

    const signInHandle = () => {
        const userName = userNameRef.current?.value;
        const password = passwordRef.current?.value;

        TkbSguApi.login(userName, password)
            .then((result) => {
                if (result instanceof UserApi) {
                    dispath({ type: 'SET-USER', value: result });
                    navigate('/');
                }
            })
            .catch((err) => {});
    };

    return (
        <div className="sign-up-wall">
            <div className="sign-up-content">
                <h1 className="title">SignIn</h1>
                <div className="line">
                    <input type="text" ref={userNameRef} placeholder="Tên đăng nhập" />
                </div>
                <div className="line">
                    <input type="password" ref={passwordRef} placeholder="Mật khẩu" />
                </div>
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

                <button className="fb">Lognin with facebook</button>

                <button className="gg">Lognin with google</button>
            </div>
        </div>
    );
}

export default Signin;
