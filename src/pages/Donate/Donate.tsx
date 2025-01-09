import classNames from 'classnames/bind';
import { FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { apiConfig } from '../../config';
import { ApiResponse } from '../../Service';
import { globalContent } from '../../store/GlobalContent';
import style from './Donate.module.scss';
const cx = classNames.bind(style);

export default function Donate() {
    const nav = useNavigate();
    const [globalState] = useContext(globalContent);
    const [amount, setAmount] = useState(5_000);
    const [frequency, setFrequency] = useState(true);
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [qrId, setQrId] = useState('');

    const submitHander = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(e);

        setIsLoading(true);

        globalState.client.request
            .post<
                ApiResponse<{
                    qrId: string;
                    userExtit: boolean;
                }>
            >(apiConfig.createTransfer(), {
                frequency: frequency ? 'onetime' : 'moth',
                amount: amount,
                name: name,
            })
            .then((e) => {
                if (!e.data.success || !e.data.data) {
                    return;
                }

                if (!e.data.data.userExtit) {
                    setQrId(e.data.data.qrId);
                    setShowPopup(true);
                    return;
                }
                nav(e.data.data.qrId);
            });
    };

    return (
        <section className={cx('donate')}>
            <Popup open={showPopup} onClose={() => setShowPopup(false)}>
                <div className={cx('popup')}>
                    <h2 className={cx('popup-title')}>Không tìm thấy tài khoản</h2>
                    <p className={cx('popup-description')}>
                        Chúng tôi không tìm thấy tài khoản của bạn. Bạn có thể tiếp tục mà không cần tài khoản.
                    </p>
                    <button
                        className={cx('btn')}
                        onClick={() => {
                            nav(qrId);
                        }}
                    >
                        Tiếp tục không cần tài khoản
                    </button>
                </div>
            </Popup>
            <div className={cx('container')}>
                <div className={cx('donate-content')}>
                    <div className={cx('donate-info')}>
                        <h2 className={cx('donate-title')}>Help us do more</h2>
                        <p className={cx('donate-description')}>
                            Chúng tôi rất cần sự hỗ trợ từ bạn. Là một tổ chức phi lợi nhuận, chỉ với 5.000 đồng mỗi
                            tháng, bạn có thể giúp chúng tôi duy chì và phát triển.
                        </p>
                        <p className={cx('donate-description')} style={{ marginTop: '10px' }}>
                            Để tri ân, chúng tôi sẽ dành những ưu đãi đặc biệt cho những người đồng hành. Mỗi đóng góp,
                            dù nhỏ, đều rất ý nghĩa. Cảm ơn bạn đã luôn ủng hộ!
                        </p>
                    </div>
                    <div className={cx('donate-actions')}>
                        <form className={cx('donate-form')} onSubmit={submitHander}>
                            <div className={cx('input', 'frequency')}>
                                <h4 className={cx('input-title')}>Select gift frequency</h4>
                                <div className={cx('input-action')}>
                                    <label className={cx('label')} htmlFor="one-time">
                                        <span className={cx('label-title')}>One time</span>
                                        <input
                                            type="radio"
                                            name="select-timing"
                                            id="one-time"
                                            checked={frequency}
                                            onChange={(e) => setFrequency(true)}
                                        />
                                    </label>
                                    <label className={cx('label')} htmlFor="monthly">
                                        <span className={cx('label-title')}>Monthly</span>
                                        <input
                                            disabled
                                            type="radio"
                                            name="select-timing"
                                            id="monthly"
                                            checked={!frequency}
                                            onChange={(e) => setFrequency(false)}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className={cx('input', 'amount')}>
                                <h4 className={cx('input-title')}>Select amount</h4>
                                <div className={cx('input-action')}>
                                    <label className={cx('label')}>
                                        <span className={cx('label-title')}>5K</span>
                                        <input
                                            type="radio"
                                            name="select-amount"
                                            checked={amount === 5000}
                                            onChange={(e) => setAmount(5000)}
                                        />
                                    </label>
                                    <label className={cx('label')}>
                                        <span className={cx('label-title')}>10K</span>
                                        <input
                                            type="radio"
                                            name="select-amount"
                                            checked={amount === 10_000}
                                            onChange={(e) => setAmount(10_000)}
                                        />
                                    </label>
                                    <label className={cx('label')}>
                                        <span className={cx('label-title')}>20K</span>
                                        <input
                                            type="radio"
                                            name="select-amount"
                                            checked={amount === 20_000}
                                            onChange={(e) => setAmount(20_000)}
                                        />
                                    </label>
                                    <label className={cx('label')}>
                                        <span className={cx('label-title')}>30K</span>
                                        <input
                                            type="radio"
                                            name="select-amount"
                                            checked={amount === 30_000}
                                            onChange={(e) => setAmount(30_000)}
                                        />
                                    </label>
                                    <label className={cx('label')}>
                                        <span className={cx('label-title')}>other</span>
                                        <input
                                            type="radio"
                                            name="select-amount"
                                            checked={amount === -1}
                                            onChange={(e) => setAmount(-1)}
                                        />
                                    </label>
                                </div>
                            </div>
                            {/* <div className={cx('input', 'info-note')}>
                                    <label htmlFor="add-donate" className={cx('label')}>
                                        <span className={cx('label-title')}>
                                            Yes, I’ll generously add $0.75 each month to cover the transaction fees.
                                        </span>
                                        <input type="checkbox" name="add-donate" id="add-donate" />
                                    </label>
                                </div> */}
                            <div className={cx('input', 'name')}>
                                <h4 className={cx('input-title')}>name & email</h4>
                                <input
                                    type="text"
                                    required
                                    name="name"
                                    placeholder="Nhập tên và email tài khoản của bạn"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {/* <Link to={'#'}>Click here to give in honor of other person</Link> */}
                            </div>
                            <div className={cx('input', 'button')}>
                                <input type="submit" defaultValue="Donate now" className={cx('btn')} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
