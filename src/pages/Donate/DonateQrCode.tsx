import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import images from '../../assets/images';
import { apiConfig } from '../../config';
import { ApiResponse } from '../../Service';
import { globalContent } from '../../store/GlobalContent';
import QRCode, { QrRef } from '../components/QRcode/QRcode';
import style from './Donate.module.scss';
import QrLoading from './qrLoading';
const cx = classNames.bind(style);

function UseCountDown(callback: () => void, time: number, deps: any[]) {
    const start = useRef<number>(0);
    const nextAt = useRef<number>(0);
    const ref = useRef<{
        clear: () => void;
    }>({
        clear: () => {
            if (timeOutRef.current) clearTimeout(timeOutRef.current);
        },
    });

    const timeOutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const f = () => {
            nextAt.current += time;

            callback();

            timeOutRef.current = setTimeout(f, nextAt.current - new Date().getTime());
        };

        if (timeOutRef.current) clearTimeout(timeOutRef.current);
        start.current = new Date().getTime();
        nextAt.current = start.current + time;
        f();

        return () => {
            if (timeOutRef.current) clearTimeout(timeOutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return ref;
}

export default function DonateQrCode() {
    const [globalState] = useContext(globalContent);
    const { qrId } = useParams();

    const [qrEx, setQrEx] = useState(-1);
    const [qrData, setQrData] = useState('');
    const [qrLoading, setQrLoading] = useState(true);
    const [payEd, setPayEd] = useState(false);
    const qrRef = useRef<QrRef>(null);

    const timeOutRef = UseCountDown(
        () => {
            setQrEx((e) => {
                if (e > 0) return e - 1;
                return e;
            });
        },
        1000,
        []
    );

    const nav = useNavigate();

    useEffect(() => {
        async function getQr() {
            if (!qrId) return;
            const res = await globalState.client.request.get<
                ApiResponse<{
                    qrData: string;
                    qrEx: number;
                    qrId: string;
                    isPayed: boolean;
                }>
            >(apiConfig.getQr(qrId));

            console.log(res);

            if (res.data.success) {
                globalState.client.socket.emit('onPayment', qrId);
                globalState.client.socket.on('paymentSuccess', (data) => {
                    setPayEd(true);
                    timeOutRef.current?.clear();
                });
            }

            setQrLoading(false);
            res.data.data && setQrData(res.data.data?.qrData || '');
            setQrEx(res.data.data?.qrEx || 0);
            setPayEd(res.data.data?.isPayed || false);

            if (res.data.data?.isPayed) {
                setQrEx(0);
                timeOutRef.current?.clear();
                // TODO:
            }
        }

        getQr();
    }, [qrId]);

    const back = () => {
        nav(-1);
    };

    return (
        <section className={cx('donate')}>
            <div className={cx('container')}>
                <div className={cx('donate-content')}>
                    <div className={cx('donate-info', 'qr-info')}>
                        <span
                            onClick={back}
                            style={{
                                cursor: 'pointer',
                                width: 'fit-content',
                            }}
                        >
                            <FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon>
                            back
                        </span>

                        {payEd ? (
                            <>
                                <h2 className={cx('donate-title')}>Thanh toán thành công</h2>
                                <p className={cx('donate-description')}>
                                    Cảm ơn bạn đã ủng hộ chúng tôi, chúng tôi sẽ cố gắng hơn nữa để phát triển không phụ
                                    lòng mọi người.
                                </p>
                                <div onClick={() => nav('/')} className={cx('qr-time')}>
                                    Quay lại trang Home
                                </div>
                            </>
                        ) : qrEx === 0 ? (
                            <>
                                <h2 className={cx('donate-title')}>Mã qr đã hết hạng</h2>
                                <p className={cx('note')}>
                                    NOTE: nếu bạn đã chuyển tiền thì đừng lo lắng chúng tôi vẫn sử lý thanh toán kể cả
                                    khi mã qr đã hết hạng.
                                </p>
                                <div className={cx('qr-time')}>Bạn có thể gia hạn mã qr để tiếp tục thanh toán</div>
                            </>
                        ) : (
                            <>
                                <h2 className={cx('donate-title')}>Quét mã qr</h2>
                                <p className={cx('donate-description')}>
                                    1. Mở ứng ụng ngân hàng trên điện thoại <br />
                                    2. Chọn quét mã qr
                                    <br />
                                    3. Quét mã qr này và thanh toán
                                </p>
                                <p className={cx('note')}>NOTE: lưu ý không được thay đổi nội dung thanh toán</p>
                                <div className={cx('qr-time')}>
                                    Giao dịnh kết thúc sau: {(qrEx / 60).toFixed(0).padStart(2, '0')}:
                                    {(qrEx % 60).toFixed(0).padStart(2, '0')}S
                                </div>
                            </>
                        )}
                    </div>
                    <div className={cx('donate-actions', 'qr')}>
                        <div className={cx('qr-container', qrEx === 0 ? 'expired' : '')}>
                            {qrLoading ? (
                                <QrLoading />
                            ) : (
                                <QRCode
                                    ref={qrRef}
                                    contents={qrData}
                                    positionRingColor="#08918a"
                                    moduleColor="#000"
                                    positionCenterColor="#000"
                                    lever="Q"
                                ></QRCode>
                            )}
                        </div>
                        {payEd && (
                            <div className={cx('qr-actionyis')}>
                                <img src={images.gift} alt="" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
