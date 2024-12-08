import { faAngleDown, faAngleUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { NotifyMaster } from '../../components/NotifyPopup';
import { DsNhomHocResp, TkbInfo } from '../../Service';
import { hashCode } from '../../utils';
// import { cx } from './Tkb';
import style from './HocPhan.module.scss';

const cx = classNames.bind(style);

interface HocPhanProps {
    data?: DsNhomHocResp;
    tkb?: TkbInfo;
    id_to_hocs: string[];
    maHocPhan: string;
    mini: number;
    onAddNhomHoc: (idToHoc: string) => void;
    onRemoveHp: (maHocPhan: string) => void;
}

export function HocPhan({
    mini,
    data,
    tkb,
    maHocPhan,
    id_to_hocs,
    onAddNhomHoc,
    onRemoveHp,
}: HocPhanProps) {
    const nhomHoc = data?.ds_nhom_to.filter((j) => j.ma_mon === maHocPhan);
    const [show, setShow] = useState(false);
    const [closeShow, setCloseShow] = useState(false);
    const setTimeOutId = useRef<NodeJS.Timeout>();

    const hocphanDropDownRef = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        setShow(false);
    }, [mini]);

    return (
        <div className={cx('hocphan')}>
            <div
                className={cx('hocphan-title')}
                onClick={() => setShow((e) => !e)}
                onMouseEnter={() => {
                    setTimeOutId.current = setTimeout(() => {
                        setCloseShow(true);
                    }, 500);
                }}
                onMouseLeave={() => {
                    clearTimeout(setTimeOutId.current);
                    setCloseShow(false);
                }}
            >
                <FontAwesomeIcon icon={show ? faAngleDown : faAngleUp} />
                <p className={cx('hocphan-name')}>{data?.ds_mon_hoc[maHocPhan]}</p>
                <div
                    className={cx('close-icon')}
                    onClick={() => {
                        onRemoveHp(maHocPhan);
                    }}
                >
                    {closeShow ? <FontAwesomeIcon icon={faXmark} /> : ''}
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
                                // check: tkb?.id_to_hocs.includes(j.id_to_hoc),
                            })}
                            style={{
                                background: id_to_hocs.includes(j.id_to_hoc)
                                    ? `hsl(${Math.abs(
                                          hashCode(maHocPhan || '0'),
                                      )} var(--tkb-nhom-view-HSL) )`
                                    : 'transparent',
                            }}
                            key={j.id_to_hoc}
                            onClick={() => {
                                if (noData) {
                                    NotifyMaster.warning(
                                        'Môn này dữ liệu tkb chưa được nhà trường làm dõ nên để hạn chế lỗi và xếp thời tkb không chích xác buộc chúng tôi phải vô hiệu nó.',
                                        'Cảnh báo',
                                        10000,
                                    );
                                    return;
                                }

                                onAddNhomHoc(j.id_to_hoc);
                            }}
                        >
                            {j.tkb.length !== 0 ? (
                                <>
                                    <p>
                                        Thứ:{' '}
                                        {j.tkb
                                            .map((i) => i.thu + ` (${i.tbd} - ${i.tkt})`)
                                            .join(', ')}
                                    </p>
                                    <p>
                                        GV:{' '}
                                        {Array.from(
                                            new Set(j.tkb.map((i) => i.gv + (i.th ? '(TH)' : ''))),
                                        ).join(', ')}
                                    </p>
                                    <p>Nhóm: {j.nhom}</p>
                                    <p>
                                        Phòng:{' '}
                                        {Array.from(new Set(j.tkb.map((i) => i.phong))).join(', ')}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>Nhóm: {j.nhom}</p>
                                    <p>Chưa có dữ liệu</p>
                                </>
                            )}

                            {/* <p>Lớp: {j.lop.ma}</p> */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
