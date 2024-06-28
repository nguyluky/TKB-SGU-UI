import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { TkbData } from '../../Service';
import { DsNhomHocResp, cx } from './Tkb';

export function HocPhan({
    data,
    tkb,
    maHocPhan,
    onAddNhomHoc,
}: {
    data?: DsNhomHocResp;
    tkb?: TkbData;
    maHocPhan: string;
    onAddNhomHoc: (idToHoc: string) => void;
}) {
    var nhomHoc = data?.ds_nhom_to.filter((j) => j.ma_mon === maHocPhan);
    const [show, setShow] = useState(true);

    return (
        <div className={cx('hocphan')}>
            <div className={cx('hocphan-title')} onClick={() => setShow((e) => !e)}>
                <FontAwesomeIcon icon={show ? faAngleDown : faAngleUp} />
                <p>{data?.ds_mon_hoc[maHocPhan]}</p>
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
                            <p>
                                GV:{' '}
                                {Array.from(
                                    new Set(j.tkb.map((i) => i.gv + (i.th ? '(TH)' : ''))),
                                ).join(', ')}
                            </p>
                            <p>
                                Phong: {Array.from(new Set(j.tkb.map((i) => i.phong))).join(', ')}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
