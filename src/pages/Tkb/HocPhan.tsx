import { faAngleDown, faAngleUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { DsNhomHocResp, TkbData } from '../../Service';
import { cx } from './Tkb';

interface HocPhanProps {
    data?: DsNhomHocResp;
    tkb?: TkbData;
    maHocPhan: string;
    mini: number;
    onAddNhomHoc: (idToHoc: string) => void;
    onRemoveHp: (maHocPhan: string) => void;
}

export function HocPhan({ mini, data, tkb, maHocPhan, onAddNhomHoc, onRemoveHp }: HocPhanProps) {
    var nhomHoc = data?.ds_nhom_to.filter((j) => j.ma_mon === maHocPhan);
    const [show, setShow] = useState(true);
    const [closeShow, setCloseShow] = useState(false);
    const setTimeOutId = useRef<NodeJS.Timeout>();

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
                className={cx('hocphan-dropdown', {
                    show: show,
                })}
            >
                {nhomHoc?.map((j) => {
                    return (
                        <div
                            className={cx('nhom', {
                                // check: tkb?.id_to_hocs.includes(j.id_to_hoc),
                            })}
                            style={{
                                background: tkb?.id_to_hocs.includes(j.id_to_hoc)
                                    ? `hsl(${Math.abs(+(maHocPhan || 1))}, 60%, 50%)`
                                    : 'transparent',
                            }}
                            key={j.id_to_hoc}
                            onClick={() => {
                                onAddNhomHoc(j.id_to_hoc);
                            }}
                        >
                            <p>
                                Thứ: {j.tkb.map((i) => i.thu + ` (${i.tbd} - ${i.tkt})`).join(', ')}
                            </p>
                            <p>
                                GV:{' '}
                                {Array.from(
                                    new Set(j.tkb.map((i) => i.gv + (i.th ? '(TH)' : ''))),
                                ).join(', ')}
                            </p>
                            <p>
                                Phòng: {Array.from(new Set(j.tkb.map((i) => i.phong))).join(', ')}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
