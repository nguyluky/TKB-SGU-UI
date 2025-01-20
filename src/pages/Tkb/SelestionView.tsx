import { faAngleDown, faAngleUp, faPlus, faSquareMinus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';
import Popup from '../../components/Popup';

import { DsNhomHocResp, NhomHoc, TkbInfo, TkbTiet } from '../../Service';
import { hashCode } from '../../utils';
import { AddHp } from './AddHp';
import { HocPhan } from './HocPhan';

// import { cx } from './Tkb';

import style from './SelestionView.module.scss';

const cx = classNames.bind(style);

interface selestionViewPro {
    dsNhomHoc?: DsNhomHocResp;
    tkbData?: TkbInfo;
    ma_hoc_phans: string[];
    id_to_hocs: string[];
    soTC: number;
    onRemoveHp: (maHocPhan: string) => void;
    onAddHp: (maHocPhan: string) => void;
    onAddNhomHoc: (idToHoc: string, isTimeLine?: boolean, replay?: boolean) => void;
    onRemoveNhomHoc: (idToHoc: string) => void;
}

export function SelestionView({ dsNhomHoc, onAddHp, onRemoveHp, ma_hoc_phans, tkbData, soTC }: selestionViewPro) {
    const [mini, setMini] = useState<number>(0);
    const toggleHp = (mhp: string) => {
        if (!tkbData) return;
        if (ma_hoc_phans.includes(mhp)) onRemoveHp(mhp);
        else onAddHp(mhp);
    };

    return (
        <div className={cx('side-bar-wrapper')}>
            <div className={cx('header')}>
                <p>Tín chỉ : {soTC} / 26</p>

                <FontAwesomeIcon
                    icon={faSquareMinus}
                    className={cx('mini')}
                    onClick={() => {
                        setMini((e) => e + 1);
                    }}
                />
                <Popup trigger={<FontAwesomeIcon icon={faPlus} />} modal>
                    <AddHp data={dsNhomHoc} onAddHp={toggleHp} maHocPhans={ma_hoc_phans} />
                </Popup>
            </div>

            <div className={cx('content')}>
                <SimpleBar
                    style={{
                        maxHeight: '100%',
                    }}
                >
                    {ma_hoc_phans.map((e) => (
                        <HocPhan mini={mini} key={e} maHocPhan={e} />
                    ))}
                </SimpleBar>
            </div>
        </div>
    );
}

function Temp({
    data,
    dsNhomHoc,
    id_to_hocs,
    ma_hoc_phans,
    onAddNhomHoc,
    maMonHoc,
}: {
    id_to_hocs: string[];
    ma_hoc_phans: string[];
    dsNhomHoc: NhomHoc[];
    tkbData?: TkbInfo;
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
                <p className={cx('hocphan-name')}>{data?.ds_mon_hoc.find((e) => e.id === maMonHoc)?.display_name}</p>
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
                                    check: id_to_hocs.includes(j.id_to_hoc),
                                })}
                                style={{
                                    background: id_to_hocs.includes(j.id_to_hoc)
                                        ? `hsl(${Math.abs(hashCode(maMonHoc || '0'))} var(--tkb-nhom-view-HSL) )`
                                        : 'transparent',
                                }}
                                key={j.id_to_hoc}
                                onClick={() => {
                                    onAddNhomHoc(j.id_to_hoc);
                                }}
                            >
                                <p>Thứ: {j.tkb.map((i) => i.thu + ` (${i.tbd} - ${i.tkt})`).join(', ')}</p>
                                <p>
                                    GV: {Array.from(new Set(j.tkb.map((i) => i.gv + (i.th ? '(TH)' : '')))).join(', ')}
                                </p>
                                <p>Phòng: {Array.from(new Set(j.tkb.map((i) => i.phong))).join(', ')}</p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

function timNhomHocTuongTu(tkbs: TkbTiet[], fromDS: NhomHoc[]) {
    const listTiet: string[] = [];

    tkbs.forEach((e) => {
        for (let index = e.tbd; index < e.tkt; index++) {
            listTiet.push(`${e.thu}${index}`);
        }
    });

    // kết quả chả về
    const nhomHocCanFix: NhomHoc[] = [];

    fromDS.forEach((e) => {
        const listTietCurr: string[] = [];
        e.tkb.forEach((jj) => {
            for (let index = jj.tbd; index < jj.tkt; index++) {
                listTietCurr.push(`${jj.thu}${index}`);
            }
        });

        let laCon = true;
        for (let index = 0; index < listTietCurr.length; index++) {
            const element = listTietCurr[index];

            if (!listTiet.includes(element)) laCon = false;
        }

        if (laCon) {
            nhomHocCanFix.push(e);
        }
    });

    return nhomHocCanFix;
}

interface ReplaceViewProps {
    idNhomHocToReplace: string[];
    ma_hoc_phans: string[];
    id_to_hocs: string[];
    dsNhomHoc?: DsNhomHocResp;
    tkbData?: TkbInfo;
    onAddNhomHoc: (idToHoc: string, isTimeLine?: boolean, replay?: boolean) => void;
    onRemoveNhomHoc: (idToHoc: string) => void;
    onClose: () => void;
}

export function ReplaceView({
    idNhomHocToReplace,
    dsNhomHoc,
    tkbData,
    ma_hoc_phans,
    id_to_hocs,
    onAddNhomHoc,
    onRemoveNhomHoc,
    onClose,
}: ReplaceViewProps) {
    const [replayItem, setReplayItem] = useState<NhomHoc[]>([]);
    const [dsMaHocPhan, setDsMaHocPhan] = useState<string[]>([]);

    const toggleHp = (mhp: string) => {
        console.log(mhp);
        if (!tkbData) return;
        if (ma_hoc_phans.includes(mhp)) onRemoveNhomHoc(mhp);
        else onAddNhomHoc(mhp, false, true);
    };

    useEffect(() => {
        const tkbs: TkbTiet[] = [];

        idNhomHocToReplace.forEach((e) => {
            const nhomHoc = dsNhomHoc?.ds_nhom_to.find((j) => j.id_to_hoc === e);

            nhomHoc?.tkb.forEach((jj) => {
                tkbs.push(jj);
            });
        });

        const listAllNhomHocs: NhomHoc[] =
            dsNhomHoc?.ds_nhom_to.filter((jjj) => ma_hoc_phans.includes(jjj.ma_mon)) || [];

        const dsNhomHoc_ = timNhomHocTuongTu(tkbs, listAllNhomHocs);

        // console.log(dsNhomHoc_);
        setReplayItem(dsNhomHoc_);
        setDsMaHocPhan(Array.from(new Set(dsNhomHoc_.map((e) => e.ma_mon))));
    }, [dsNhomHoc?.ds_nhom_to, idNhomHocToReplace, ma_hoc_phans]);

    return (
        <div className={cx('side-bar-wrapper')}>
            <div className={cx('header')}>
                <p>Môn tương tự</p>
                <FontAwesomeIcon
                    className={cx('mini')}
                    icon={faXmark}
                    onClick={() => {
                        onClose();
                    }}
                />
            </div>
            <div className={cx('content')}>
                {dsMaHocPhan.map((e, i) => (
                    <Temp
                        key={i}
                        data={dsNhomHoc}
                        tkbData={tkbData}
                        ma_hoc_phans={ma_hoc_phans}
                        id_to_hocs={id_to_hocs}
                        maMonHoc={e}
                        dsNhomHoc={replayItem}
                        onAddNhomHoc={toggleHp}
                    />
                ))}
            </div>
        </div>
    );
}
