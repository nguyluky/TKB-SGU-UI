import { faAt } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonWithLoading from '../../components/ButtonWithLoading';
import Input from '../../components/Input';
import { globalContent } from '../../store/GlobalContent';
import Background from '../components/Background';
import style from './ForgetPassword.module.scss';

const cx = classNames.bind(style);

export default function ForgetPassword() {
    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [globalState] = useContext(globalContent);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email);

        // Call API to send email

        setIsLoading(true);

        globalState.client.serverApi.forgetPassword(email).then((res) => {
            setIsLoading(false);
            if (res.success) {
                setIsSending(true);
            } else {
                emailRef.current?.setCustomValidity(res.msg);
                emailRef.current?.reportValidity();
                emailRef.current?.focus();
                emailRef.current?.select();
            }
        });
    };

    return (
        <Background className={cx('forget-password')}>
            <div className={cx('header')}>
                <h1 onClick={() => nav('/tkbs')}>TKB SGU</h1>
                <div className={cx('auth')}>
                    <ButtonWithLoading onClick={() => nav('/tkbs?login=1')}>Đăng nhập</ButtonWithLoading>
                    <ButtonWithLoading onClick={() => nav('/tkbs?registration=1')}>Đăng ký</ButtonWithLoading>
                </div>
            </div>
            <div className={cx('body')}>
                <div className={cx('content')}>
                    {isSending ? (
                        <>
                            <h2>Yêu cầu đã được gửi</h2>
                            <p>Vui lòng kiểm tra email của bạn để nhận hướng dẫn khôi phục mật khẩu.</p>
                            <p>Nếu không thấy email, vui lòng kiểm tra thư mục spam hoặc thùng rác.</p>
                            <ButtonWithLoading className={cx('back')} onClick={() => nav('/tkbs?login=1')}>
                                Quay lại trang đăng nhập
                            </ButtonWithLoading>
                        </>
                    ) : (
                        <>
                            <h2>Quên mật khẩu</h2>
                            <p>Vui lòng nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu.</p>
                            <form onSubmit={handleSubmit}>
                                <div className={cx('input-group')}>
                                    <Input
                                        className={cx('input')}
                                        title=""
                                        ref={emailRef}
                                        icon={faAt}
                                        type="email"
                                        placeholder="Nhập email của bạn"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            e.target.setCustomValidity('');
                                        }}
                                    />
                                </div>
                                <div className={cx('input-group')}>
                                    {/* <button type="submit">Gửi</button> */}
                                    <ButtonWithLoading isLoading={isLoading}>Gửi</ButtonWithLoading>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </Background>
    );
}
