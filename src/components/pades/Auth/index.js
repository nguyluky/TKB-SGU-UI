import { Outlet } from 'react-router-dom';
import './Signup.scss';

function Auth() {
    // const signUpHandle = () => {
    //     console.log(userName, password, email);

    //     if (password !== password2) {
    //         setErr('Mật khẩu không hớp');
    //         return;
    //     }

    //     TkbSguApi.signup(userName, password, email, null).then((e) => {
    //         if (e.success) {
    //             setSearchParams({ err: 'ok' });
    //             return;
    //         }

    //         setErr(e.msg + ' - ' + e.code);
    //     });
    // };

    return (
        <div className="sign-up-wall">
            <div className="sign-up-content">
                <div className="conten">
                    <Outlet />
                </div>

                <div className="or">
                    <div className="vr" />
                    <p>OR</p>
                    <div className="vr" />
                </div>

                <button className="fb">with facebook</button>

                <button className="gg">with google</button>
            </div>
        </div>
    );
}

export default Auth;
