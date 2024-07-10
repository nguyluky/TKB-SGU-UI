import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Popup from 'reactjs-popup';

import { ApiResponse, DsNhomHocResp, TkbData, TkbTiet } from '../../Service';
import { headerContent } from '../../components/Layout/DefaultLayout';
import { NotifyMaster } from '../../components/NotifyPopup';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import { globalContent } from '../../store/GlobalContent';
import { textSaveAsFile } from '../../utils';
import Error from '../Error';
import Calendar from '../components/Calendar';
import Loader from '../components/Loader';
import { AddHp } from './AddHp';
import { HeaderTool } from './HeaderTool';
import { HocPhan } from './HocPhan';
import { ReName } from './ReName';
import style from './Tkb.module.scss';

export const cx = classNames.bind(style);

var cacheDsNhomHoc: DsNhomHocResp;

function addSelectedPeriod(tkbs: TkbTiet[], newSlot: Set<string>) {
    tkbs.forEach((e) => {
        var thu = e.thu;
        var cs = e.phong.substring(0, 1);

        for (let index = e.tbd; index <= e.tkt; index++) {
            const hash = thu + '-' + index + '-' + cs;
            newSlot.add(hash);
        }
    });
}

function removeSelectedPeriod(tkbs: TkbTiet[], slotEdit: Set<string>) {
    tkbs.forEach((e) => {
        var thu = e.thu;
        var cs = e.phong.substring(0, 1);

        for (let index = e.tbd; index <= e.tkt; index++) {
            const hash = thu + '-' + index + '-' + cs;
            slotEdit.delete(hash);
        }
    });
}

function checkSelectedPeriod(tkbs: TkbTiet[], slotEdit: Set<string>) {
    return tkbs.find((e) => {
        var thu = e.thu;
        var cs = e.phong.substring(0, 1);

        for (let index = e.tbd; index <= e.tkt; index++) {
            const hash = thu + '-' + index + '-' + cs;
            if (slotEdit.has(hash)) return true;
        }
        return false;
    });
}

function checkIfDifferentLocation(tkbs: TkbTiet[], slotEdit: Set<string>) {
    var thuTietCs = Array.from(slotEdit).map((e) => e.split('-'));

    return tkbs.find((e) => {
        var thu = e.thu;
        var cs = e.phong.substring(0, 1);

        if (e.tbd < 6) {
            return !!thuTietCs.find((j) => j[0] === thu && +j[1] < 6 && j[2] !== cs);
        } else {
            return !!thuTietCs.find((j) => j[0] === thu && +j[1] >= 6 && j[2] !== cs);
        }
    });
}

function Tkb() {
    const setHeaderPar = useContext(headerContent);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [globalState, setGlobalState] = useContext(globalContent);

    const [tkbData, setTkbData] = useState<TkbData | undefined>();
    const [dsNhomAndMon, setDsNhomAndMon] = useState<DsNhomHocResp | undefined>();
    const [soTC, setSoTC] = useState<number>(0);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [canSave, setCanSave] = useState<boolean>(false);
    const [isLoading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState('');
    // NOTE: vá lỗi
    const tkbDateRef = useRef<TkbData>();

    const cache = useRef<{ [key: string]: string }>({});
    const idTimeOut = useRef<NodeJS.Timeout | undefined>(undefined);
    const slotSelectedPeriod = useRef<Set<string>>(new Set());

    const [searchParams] = useSearchParams();
    const { tkbid } = useParams();

    const onAddHphandler = (maHocPhan: string) => {
        if (!tkbData) return;
        if (tkbData.ma_hoc_phans.includes(maHocPhan)) {
            var index = tkbData.ma_hoc_phans.indexOf(maHocPhan);
            tkbData.ma_hoc_phans.splice(index, 1);
            if (cache.current[maHocPhan]) {
                onAddNhomHocHandler(cache.current[maHocPhan]);
            }
        } else tkbData.ma_hoc_phans.push(maHocPhan);

        setTkbData({ ...tkbData });
    };

    const onAddNhomHocHandler = (idToHoc: string) => {
        const makeNewTkb = () => {
            if (!tkbData) return null;

            // lấy nhóm học và mã môn học
            var nhomhoc = dsNhomAndMon?.ds_nhom_to.find((j) => j.id_to_hoc === idToHoc);
            var ma_mon = nhomhoc?.ma_mon;
            if (!ma_mon || !nhomhoc) return null;

            // nếu môn đó đã chọn nhóm học thì xoá nhóm đó
            if (cache.current[ma_mon]) {
                var preIdToHoc = cache.current[ma_mon];
                var preNhomHoc = dsNhomAndMon?.ds_nhom_to.find((j) => j.id_to_hoc === preIdToHoc);

                if (preNhomHoc) removeSelectedPeriod(preNhomHoc.tkb, slotSelectedPeriod.current);
                var index = tkbData.id_to_hocs.indexOf(cache.current[ma_mon]);
                if (index >= 0) {
                    tkbData.id_to_hocs.splice(index, 1);
                    cache.current[ma_mon] = '';
                }

                if (preIdToHoc === idToHoc) return { ...tkbData };
            }

            // kiểm tra xem môn chọn có bị chùng tiết hay không
            var overlap = checkSelectedPeriod(nhomhoc.tkb, slotSelectedPeriod.current);

            // nếu có báo lỗi
            if (overlap) {
                console.info('Tiết bị chùng', overlap);
                NotifyMaster.error(
                    'Chùng tiết với ' +
                        overlap.gv +
                        '. Thứ ' +
                        overlap.thu +
                        '. Tiết ' +
                        overlap.tbd,
                );
                return null;
            }

            // kiểm tra xem có khác cơ sử hay không
            // NOTE: không thể kiểm tra xem đúng hay sai
            // NOTE: Tại được
            var tietCacCoSo = checkIfDifferentLocation(nhomhoc.tkb, slotSelectedPeriod.current);
            if (tietCacCoSo) {
                NotifyMaster.error(
                    'Khác cơ sở tiêt ' +
                        tietCacCoSo.gv +
                        '. Thứ ' +
                        tietCacCoSo.thu +
                        '. Tiết ' +
                        tietCacCoSo.tbd,
                );
                return null;
            }

            // cập nhật slot
            addSelectedPeriod(nhomhoc.tkb, slotSelectedPeriod.current);

            // thêm cái mới vào
            cache.current[ma_mon] = idToHoc;
            tkbData.id_to_hocs.push(idToHoc);
            return { ...tkbData };
        };

        var newData = makeNewTkb();

        if (newData) setTkbData(newData);
    };

    const onRenameHandler = (s: string) => {
        setTkbData((e) => {
            if (!e) return e;
            e.name = s;
            return { ...e };
        });
    };

    const saveAsFile = () => {
        var a = tkbData?.id_to_hocs.map((e) => {
            var nhom = dsNhomAndMon?.ds_nhom_to.find((j) => j.id_to_hoc === e);

            return {
                mhp: nhom?.ma_mon,
                ten: nhom?.ten_mon,
                nhom: '?',
                id_to_hoc: e,
            };
        });

        const textFile = {
            name: tkbData?.name,
            created: tkbData?.created.toString(),
            data: a,
        };

        textSaveAsFile(JSON.stringify(textFile));
    };

    const doUpdate = () => {
        // console.log(tkbDateRef.current);
        console.log('dosave');
        if (!tkbDateRef.current) return;
        if (tkbDateRef.current?.isClient) {
            setIsSaving(true);
            setIsSaving(true);
            globalState.client.localApi.updateTkb(tkbDateRef.current).then((apiresp) => {
                setIsSaving(false);
                if (apiresp.success) {
                    console.log('lưu thành công');
                } else {
                    notifyMaster.error(apiresp.msg);
                }
            });
        } else if (globalState.client.islogin() && tkbid) {
            setIsSaving(true);
            globalState.client.serverApi.updateTkb(tkbDateRef.current).then((apiresp) => {
                setIsSaving(false);
                if (apiresp.success) {
                    console.log('lưu thành công');
                } else {
                    notifyMaster.error(apiresp.msg);
                }
            });
        }
    };

    // NOTE: Lấy dữ liệu
    useLayoutEffect(() => {
        const getTkbDataClient = async () => {
            if (!tkbid) {
                const temp: ApiResponse<TkbData> = {
                    code: 400,
                    msg: 'thời khóa biểu không tồn tại',
                    success: false,
                };
                return temp;
            }

            const getTkb = globalState.client.localApi.getTkb(tkbid);
            console.log(getTkb);
            return await getTkb;
        };

        const getTkbDataServer = async () => {
            if (!tkbid) {
                const temp: ApiResponse<TkbData> = {
                    code: 400,
                    msg: 'thời khóa biểu không tồn tại',
                    success: false,
                };
                return temp;
            }

            const getTkb = globalState.client.serverApi.getTkb(tkbid);

            return await getTkb;
        };

        const getDsNhomHoc = async () => {
            if (cacheDsNhomHoc) return cacheDsNhomHoc;

            const getData = globalState.client.serverApi.getDsNhomHoc();

            cacheDsNhomHoc = await getData;

            return cacheDsNhomHoc;
        };

        var getTkbData = searchParams.get('isclient') ? getTkbDataClient : getTkbDataServer;

        // sử lý dữ liệu
        Promise.all([getTkbData(), getDsNhomHoc()]).then((re) => {
            console.log('getTkbRep', re[0]);
            console.log('getDsNhomHocRep', re[1]);

            const TkbDataResp = re[0];

            // nếu người dùng không có quền vào tkb
            if (!TkbDataResp.success || !TkbDataResp.data) {
                setHeaderPar((e) => {
                    e.left = <h3 style={{ color: 'var(--text-color)' }}>TKB SGU</h3>;
                    return { ...e };
                });

                setErrMsg(TkbDataResp.msg);
                setLoading(false);
                return;
            }

            var tkbDataRep = TkbDataResp.data;
            if (!tkbDataRep.id_to_hocs) tkbDataRep.id_to_hocs = [];
            if (!tkbDataRep.ma_hoc_phans) tkbDataRep.ma_hoc_phans = [];
            if (!tkbDataRep.tkb_describe) tkbDataRep.tkb_describe = '';
            tkbDataRep.created = new Date(tkbDataRep.created);

            // setup cache and slot
            var newCache: { [key: string]: string } = {};
            var newSlot: Set<string> = slotSelectedPeriod.current;
            tkbDataRep.id_to_hocs.forEach((e: string) => {
                var nhom = re[1].ds_nhom_to.find((j) => j.id_to_hoc === e);

                if (!nhom) return;

                // slot
                addSelectedPeriod(nhom.tkb, newSlot);

                // cache
                newCache[nhom.ma_mon] = e;
            });
            cache.current = newCache;
            slotSelectedPeriod.current = newSlot;

            setTkbData(tkbDataRep);
            setLoading(false);
            setDsNhomAndMon(re[1]);
        });

        return () => {
            doUpdate();
            if (idTimeOut.current) clearTimeout(idTimeOut.current);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tkbid, globalState.client]);

    // update header
    useEffect(() => {
        if (isLoading) return;
        if (!errMsg)
            setHeaderPar((e) => {
                e.left = <HeaderTool saveAsFile={saveAsFile} />;
                e.right = <></>;
                var tkbName = tkbData?.name || '';
                e.center = (
                    <ReName
                        defaultName={tkbName}
                        onChangeName={onRenameHandler}
                        isSave={isSaving}
                    />
                );
                return { ...e };
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSaving, tkbData, isLoading]);

    // auto save
    useEffect(() => {
        if (!canSave || isLoading) {
            setCanSave(true);
            return;
        }
        tkbDateRef.current = tkbData;

        // console.log(tkbDateRef.current);

        if (idTimeOut.current) {
            clearTimeout(idTimeOut.current);
            idTimeOut.current = undefined;
        }

        idTimeOut.current = setTimeout(doUpdate, 5000);

        var sCT = 0;
        tkbData?.id_to_hocs.forEach((e) => {
            const nhom = dsNhomAndMon?.ds_nhom_to.find((j) => j.id_to_hoc === e);
            if (nhom) sCT += nhom.so_tc;
        });

        setSoTC(sCT);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalState.client, isLoading, tkbData]);

    return (
        <Loader isLoading={isLoading}>
            {!errMsg ? (
                <div className={cx('wrapper')}>
                    <div className={cx('side-bar')}>
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
                    </div>
                    <div className={cx('calendar-wrapper')}>
                        <Calendar data={dsNhomAndMon?.ds_nhom_to} idToHocs={tkbData?.id_to_hocs} />
                    </div>
                </div>
            ) : (
                <Error msg={errMsg} />
            )}
        </Loader>
    );
}

export default Tkb;
