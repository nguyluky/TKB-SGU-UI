import { faLock } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonWithLoading from '../../components/ButtonWithLoading';
import Input from '../../components/Input';
import { globalContent } from '../../store/GlobalContent';
import Background from '../components/Background';
import Loader from '../components/Loader';
import styles from './ResetPassword.module.scss';

const cx = classNames.bind(styles);

export default function ResetPassword() {
    // TODO: Implement ResetPassword page
    const nav = useNavigate();
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');
    const [globalState] = useContext(globalContent);
    const [tab, setTab] = useState<'timeOut' | 'input' | 'success'>('timeOut');
    const [buttonLoading, setButtonLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const passwordResetEmailRef = useRef<HTMLInputElement>(null);
    const passwordResetEmail1Ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (token) {
            globalState.client.serverApi.verifyResetPasswordToken(token).then((res) => {
                setIsLoading(false);
                if (res.success) {
                    setTab('input');
                }
            });
        } else setIsLoading(false);
    }, [globalState.client.serverApi, token]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(password);

        // Call API to send email

        if (password.length < 7) {
            passwordResetEmailRef.current?.setCustomValidity('Mật khẩu phải dài hơn 7 ký tự');
            passwordResetEmailRef.current?.reportValidity();
            return;
        }

        if (password !== password1) {
            passwordResetEmail1Ref.current?.setCustomValidity('Mật khẩu không trùng khớp');
            passwordResetEmail1Ref.current?.reportValidity();
            return;
        }
        setButtonLoading(true);

        if (token)
            globalState.client.serverApi.resetPassword(token, password).then((res) => {
                setButtonLoading(false);
                if (res.success) {
                    setTab('success');
                } else {
                    passwordResetEmailRef.current?.setCustomValidity(res.msg);
                    passwordResetEmail1Ref.current?.reportValidity();
                }
            });
    };

    return (
        <Loader isLoading={isLoading}>
            <Background className={cx('reset-password')}>
                <div className={cx('header')}>
                    <h1 onClick={() => nav('/tkbs')}>TKB SGU</h1>
                    <div className={cx('auth')}>
                        <ButtonWithLoading onClick={() => nav('/tkbs?login=1')}>Đăng nhập</ButtonWithLoading>
                        <ButtonWithLoading onClick={() => nav('/tkbs?registration=1')}>Đăng ký</ButtonWithLoading>
                    </div>
                </div>
                <div className={cx('body')}>
                    <div className={cx('content')}>
                        {tab === 'success' ? (
                            <>
                                <h2>Đặt lại mật khẩu thành công.</h2>

                                <ButtonWithLoading className={cx('back')} onClick={() => nav('/tkbs?login=1')}>
                                    Quay lại trang đăng nhập
                                </ButtonWithLoading>
                            </>
                        ) : (
                            ''
                        )}
                        {tab === 'input' ? (
                            <>
                                <h2>Đặt lại mật khẩu.</h2>
                                <p>Nhập mật khẩu mới để reset lại password.</p>
                                <form onSubmit={handleSubmit}>
                                    <div className={cx('input-group')}>
                                        <Input
                                            className={cx('input')}
                                            icon={faLock}
                                            ref={passwordResetEmailRef}
                                            type="password"
                                            placeholder="Mật khẩu mới"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                e.target.setCustomValidity('');
                                            }}
                                        />
                                    </div>
                                    <div className={cx('input-group')}>
                                        <Input
                                            className={cx('input')}
                                            icon={faLock}
                                            ref={passwordResetEmail1Ref}
                                            type="password"
                                            placeholder="Nhập lại mật khẩu mới"
                                            value={password1}
                                            onChange={(e) => {
                                                setPassword1(e.target.value);
                                                e.target.setCustomValidity('');
                                            }}
                                        />
                                    </div>
                                    <div className={cx('input-group')}>
                                        <ButtonWithLoading isLoading={buttonLoading}>Xác nhận</ButtonWithLoading>
                                    </div>
                                </form>
                            </>
                        ) : (
                            ''
                        )}
                        {tab === 'timeOut' ? (
                            <>
                                <h2>Link đặt lại mật khẩu đã hết hạn. Hoặc đã được sử dụng.</h2>

                                <p>
                                    Vui lòng thử lại hoặc liên hệ với chúng tôi qua email:{' '}
                                    <a href="mailto:nguyluky@gmail.com">nguyluky@gmail.com</a>
                                </p>

                                <ButtonWithLoading className={cx('back')} onClick={() => nav('/tkbs?login=1')}>
                                    Quay lại trang đăng nhập
                                </ButtonWithLoading>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </Background>
        </Loader>
    );
}
