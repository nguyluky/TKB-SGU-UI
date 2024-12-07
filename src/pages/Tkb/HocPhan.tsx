import { faAngleDown, faAngleUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { NotifyMaster } from '../../components/NotifyPopup';
import { hashCode } from '../../utils';
// import { cx } from './Tkb';
import style from './HocPhan.module.scss';
import { tkbContext } from './Tkb';

const cx = classNames.bind(style);

interface HocPhanProps {
    maHocPhan: string;
    mini: number;
}

export function HocPhan({ mini, maHocPhan }: HocPhanProps) {
    const tkbState = useContext(tkbContext);
    const nhomHoc = tkbState.dsNhomHoc?.ds_nhom_to.filter((j) => j.ma_mon === maHocPhan);
    const [show, setShow] = useState(false);

    const hocphanDropDownRef = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        setShow(false);
    }, [mini]);

    return (
        <div className={cx('hocphan')}>
            <div className={cx('hocphan-title')} onClick={() => setShow((e) => !e)}>
                <FontAwesomeIcon icon={show ? faAngleDown : faAngleUp} />
                <p className={cx('hocphan-name')}>{tkbState.dsNhomHoc?.ds_mon_hoc[maHocPhan]}</p>
                <div
                    className={cx('close-icon')}
                    onClick={(event) => {
                        event.stopPropagation();
                        tkbState.onRemoveHphandeler(maHocPhan);
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>
            <div
                className={cx('hocphan-dropdown', { show: show })}
                ref={hocphanDropDownRef}
                style={{
                    height: show ? hocphanDropDownRef.current.scrollHeight + 'px' : 0,
                }}
            >
                {nhomHoc?.map((j) => {
                    const noData = j.tkb.find((e) => e.thu + '' === '??');

                    return (
                        <div
                            className={cx('nhom', {
                                conflict: tkbState.conflict.includes(j.id_to_hoc),
                                // check: tkb?.id_to_hocs.includes(j.id_to_hoc),
                            })}
                            style={{
                                background: tkbState.id_to_hocs.includes(j.id_to_hoc)
                                    ? `hsl(${Math.abs(hashCode(maHocPhan || '0'))} var(--tkb-nhom-view-HSL-bg))`
                                    : 'transparent',
                            }}
                            key={j.id_to_hoc}
                            onClick={() => {
                                if (noData) {
                                    NotifyMaster.warning(
                                        'Môn này dữ liệu tkb chưa được nhà trường làm dõ nên để hạn chế lỗi và xếp thời tkb không chích xác buộc chúng tôi phải vô hiệu nó.',
                                        'Cảnh báo',
                                        10000
                                    );
                                    return;
                                }

                                if (tkbState.id_to_hocs.includes(j.id_to_hoc))
                                    tkbState.onRemoveNhomHocHandler(j.id_to_hoc);
                                else tkbState.onAddNhomHocHandler(j.id_to_hoc);
                            }}
                        >
                            <p>Thứ: {j.tkb.map((i) => i.thu + ` (${i.tbd} - ${i.tkt})`).join(', ')}</p>
                            <p>GV: {Array.from(new Set(j.tkb.map((i) => i.gv + (i.th ? '(TH)' : '')))).join(', ')}</p>
                            <p>Nhóm: {j.nhom}</p>
                            <p>Phòng: {Array.from(new Set(j.tkb.map((i) => i.phong))).join(', ')}</p>
                            {/* <p>Lớp: {j.lop.ma}</p> */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
