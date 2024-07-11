import { faAngleDown, faAngleUp, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import ButtonWithLoading from '../../components/ButtonWithLoading';
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
    nhomHocReplaced,
}: {
    dsNhomHoc: DsNhomTo[];
    tkbData?: TkbData;
    onAddNhomHoc: (idToHoc: string) => void;
    data?: DsNhomHocResp;
    onClose: () => void;
    nhomHocReplaced: string[];
}) {
    var dsMaHocPhan = Array.from(new Set(dsNhomHoc.map((e) => e.ma_mon)));
    var cacheNhomHoc = useRef<{ [Key: string]: string[] }>({});
    var itemRemove = useRef<string[]>([]);
    var itemSele = useRef<string>('');

    useEffect(() => {
        var tempCache: { [Key: string]: string[] } = {};
        nhomHocReplaced.forEach((e) => {
            var temp: string[] = [];
            var nhom = data?.ds_nhom_to.find((j) => j.id_to_hoc === e);

            nhom?.tkb.forEach((jj) => {
                var cs = jj.phong.substring(0, 1);
                for (let index = jj.tbd; index <= jj.tkt; index++) {
                    const hash = jj.thu + '-' + index + '-' + cs;
                    temp.push(hash);
                }
            });

            tempCache[e] = temp;
        });

        cacheNhomHoc.current = tempCache;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // !!!!this work do touch !!!!!!!!!
    const onAddNhomHocHandler = (idNhomTo: string) => {
        // TODO:

        // xóa cái được chọn ra khỏi id_to_hocs
        // thêm các item trong itemRemove vào id_to_hocs

        // kiểm tra xem chùng với tiết nào
        // thêm vào itemRemove rồi xóa khỏi ds id_to_hocs
        // add mới vòa id_to_hocs

        // TODO: nếu mà không chùng tiết là lại chùng môn học thì xao

        if (itemSele.current) {
            onAddNhomHoc(itemSele.current);
        }

        itemRemove.current.forEach((e) => {
            if (e === idNhomTo) {
                return;
            }
            onAddNhomHoc(e);
        });

        itemRemove.current = [];

        var nhom = data?.ds_nhom_to.find((e) => e.id_to_hoc === idNhomTo);

        if (nhom) {
            var temp: string[] = [];
            nhom.tkb.forEach((jj) => {
                var cs = jj.phong.substring(0, 1);
                for (let index = jj.tbd; index <= jj.tkt; index++) {
                    const hash = jj.thu + '-' + index + '-' + cs;
                    temp.push(hash);
                }
            });

            if (tkbData?.ma_hoc_phans.includes(nhom.ma_mon)) {
                var a = tkbData.id_to_hocs.find(
                    (e) => data?.ds_nhom_to.find((j) => j.id_to_hoc === e)?.ma_mon == nhom?.ma_mon,
                );
                if (a) itemRemove.current.push(a);
            }

            Object.keys(cacheNhomHoc.current).forEach((e) => {
                if (idNhomTo === e) {
                    if (!itemRemove.current.includes(e)) itemRemove.current.push(e);
                    return;
                }
                var tkbs = cacheNhomHoc.current[e];

                var biTrung = false;

                tkbs.forEach((jj) => {
                    if (temp.includes(jj)) {
                        biTrung = true;
                    }
                });

                if (biTrung) {
                    if (!itemRemove.current.includes(e)) itemRemove.current.push(e);
                    onAddNhomHoc(e);
                }
            });

            if (idNhomTo !== itemSele.current) onAddNhomHoc(idNhomTo);
            itemSele.current = idNhomTo;

            console.log(itemSele.current, itemRemove.current);
        }
    };

    return (
        <div className={cx('side-bar-wrapper')}>
            <div className={cx('header')}>
                <p>Môn tư tự</p>
                <FontAwesomeIcon
                    icon={faXmark}
                    onClick={() => {
                        if (itemSele.current) {
                            onAddNhomHoc(itemSele.current);
                        }
                        itemRemove.current.forEach((e) => {
                            if (!tkbData?.id_to_hocs.includes(e)) onAddNhomHoc(e);
                        });
                        onClose();
                    }}
                />
            </div>

            <div className={cx('content', 'footer')}>
                {dsMaHocPhan.map((e, i) => (
                    <Temp
                        key={i}
                        data={data}
                        tkbData={tkbData}
                        maMonHoc={e}
                        dsNhomHoc={dsNhomHoc}
                        onAddNhomHoc={onAddNhomHocHandler}
                    />
                ))}
            </div>

            <div className={cx('footer-content')}>
                <ButtonWithLoading
                    onClick={() => {
                        onClose();
                    }}
                >
                    Lưu
                </ButtonWithLoading>
            </div>
        </div>
    );
}
