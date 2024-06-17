import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DsNhomHocResp, TKB, cx } from './Tkb';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export function HocPhan({
    data,
    tkb,
    maHocPhan,
    onAddNhomHoc,
}: {
    data?: DsNhomHocResp;
    tkb?: TKB;
    maHocPhan: string;
    onAddNhomHoc: (idToHoc: string) => void;
}) {
    var nhomHoc = data?.ds_nhom_to.filter((j) => j.ma_mon === maHocPhan);
    const [show, setShow] = useState(true);

    return (
        <div className={cx('hocphan')}>
            <div className={cx('hocphan-title')} onClick={() => setShow((e) => !e)}>
                <p>{data?.ds_mon_hoc[maHocPhan]}</p>
                <FontAwesomeIcon icon={faClose} />
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
                                check: tkb?.id_to_hocs.includes(j.id_to_hoc),
                            })}
                            key={j.id_to_hoc}
                            onClick={() => {
                                onAddNhomHoc(j.id_to_hoc);
                            }}
                        >
                            <p>thứ: {j.tkb.map((i) => i.thu).join(', ')}</p>
                            <p>GV: {Array.from(new Set(j.tkb.map((i) => i.gv + (i.th ? '(TH)' : '')))).join(', ')}</p>
                            <p>Phong: {Array.from(new Set(j.tkb.map((i) => i.phong))).join(', ')}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
