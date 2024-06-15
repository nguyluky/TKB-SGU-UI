import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DsNhomHocResp, cx } from './Tkb';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export function HocPhan({
    data,
    maHocPhan,
    onAddNhomHoc,
}: {
    data?: DsNhomHocResp;
    maHocPhan: string;
    onAddNhomHoc: (idToHoc: string) => void;
}) {
    var nhomHoc = data?.ds_nhom_to.filter((j) => j.ma_mon === maHocPhan);
    const [show, setShow] = useState(false);

    return (
        <div className={cx('hocphan')}>
            <div className={cx('hocphan-title')}>
                <p>{data?.ds_mon_hoc[maHocPhan]}</p>
                <FontAwesomeIcon icon={faClose} />
            </div>
            <div className={cx('hocphan-dropdown')}>
                {nhomHoc?.map((j) => {
                    return (
                        <div
                            className={cx('nhom')}
                            key={j.id_to_hoc}
                            onClick={() => {
                                onAddNhomHoc(j.id_to_hoc);
                            }}
                        >
                            <p>thứ: {j.tkb.map((i) => i.thu).join(', ')}</p>
                            <p>GV: {Array.from(new Set(j.tkb.map((i) => i.gv + (i.th ? '(TH)' : '')))).join(', ')}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
