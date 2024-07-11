import { faAngleDown, faAngleUp, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { DsNhomHocResp, DsNhomTo, TkbData } from '../../Service';
import { AddHp } from './AddHp';
import { HocPhan } from './HocPhan';
import { cx } from './Tkb';

interface selestionViewPro {
    dsNhomAndMon?: DsNhomHocResp;
    onAddHphandler: (maHocPhan: string) => void;
    tkbData?: TkbData;
    onAddNhomHocHandler: (idToHoc: string) => void;
    soTC: number;
}

export function SelestionView({
    dsNhomAndMon,
    onAddHphandler,
    tkbData,
    onAddNhomHocHandler,
    soTC,
}: selestionViewPro) {
    return (
        <div className={cx('side-bar-wrapper')}>
            <div className={cx('header')}>
                <p>Tín chỉ : {soTC} / 26</p>

                <Popup trigger={<FontAwesomeIcon icon={faPlus} />} modal>
                    <AddHp
                        data={dsNhomAndMon}
                        onAddHp={onAddHphandler}
                        maHocPhans={tkbData?.ma_hoc_phans}
                    />
                </Popup>
            </div>

            <div className={cx('content')}>
                {tkbData?.ma_hoc_phans.map((e) => (
                    <HocPhan
                        onRemoveHp={onAddHphandler}
                        data={dsNhomAndMon}
                        maHocPhan={e}
                        key={e}
                        onAddNhomHoc={onAddNhomHocHandler}
                        tkb={tkbData}
                    />
                ))}
            </div>
        </div>
    );
}

function Temp({
    data,
    dsNhomHoc,
    tkbData,
    onAddNhomHoc,
    maMonHoc,
}: {
    dsNhomHoc: DsNhomTo[];
    tkbData?: TkbData;
    onAddNhomHoc: (idToHoc: string) => void;
    data?: DsNhomHocResp;
    maMonHoc: string;
}) {
    const [closeShow, setCloseShow] = useState(false);
    const [show, setShow] = useState(true);
    const setTimeOutId = useRef<NodeJS.Timeout>();

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
                <p className={cx('hocphan-name')}>{data?.ds_mon_hoc[maMonHoc]}</p>
                <div
                    className={cx('close-icon')}
                    // onClick={() => {
                    //     onRemoveHp(maHocPhan);
                    // }}
                >
                    {closeShow ? <FontAwesomeIcon icon={faXmark} /> : ''}
                </div>
            </div>
            <div
                className={cx('hocphan-dropdown', {
                    show: show,
                })}
            >
                {dsNhomHoc
                    .filter((j) => j.ma_mon === maMonHoc)
                    .map((j) => {
                        return (
                            <div
                                className={cx('nhom', {
                                    check: tkbData?.id_to_hocs.includes(j.id_to_hoc),
                                })}
                                style={{
                                    background: tkbData?.id_to_hocs.includes(j.id_to_hoc)
                                        ? `hsl(${Math.abs(+(maMonHoc || 1))}, 60%, 50%)`
                                        : 'transparent',
                                }}
                                key={j.id_to_hoc}
                                onClick={() => {
                                    onAddNhomHoc(j.id_to_hoc);
                                }}
                            >
                                <p>
                                    Thứ:{' '}
                                    {j.tkb.map((i) => i.thu + ` (${i.tbd} - ${i.tkt})`).join(', ')}
                                </p>
                                <p>
                                    GV:{' '}
                                    {Array.from(
                                        new Set(j.tkb.map((i) => i.gv + (i.th ? '(TH)' : ''))),
                                    ).join(', ')}
                                </p>
                                <p>
                                    Phòng:{' '}
                                    {Array.from(new Set(j.tkb.map((i) => i.phong))).join(', ')}
                                </p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export function ReplaceView({
    dsNhomHoc,
    tkbData,
    onAddNhomHoc,
    data,
    onClose,
}: {
    dsNhomHoc: DsNhomTo[];
    tkbData?: TkbData;
    onAddNhomHoc: (idToHoc: string) => void;
    data?: DsNhomHocResp;
    onClose: () => void;
}) {
    var dsMaHocPhan = Array.from(new Set(dsNhomHoc.map((e) => e.ma_mon)));

    return (
        <div className={cx('side-bar-wrapper')}>
            <div className={cx('header')}>
                <p>Môn tư tự</p>
                <FontAwesomeIcon
                    icon={faXmark}
                    onClick={() => {
                        onClose();
                    }}
                />
            </div>

            <div className={cx('content')}>
                {dsMaHocPhan.map((e) => (
                    <Temp
                        data={data}
                        tkbData={tkbData}
                        maMonHoc={e}
                        dsNhomHoc={dsNhomHoc}
                        onAddNhomHoc={onAddNhomHoc}
                    />
                ))}
            </div>
        </div>
    );
}
