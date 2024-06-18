import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from 'reactjs-popup';

import { headerContent } from '../../components/Layout/DefaultLayout';
import { NotifyMaster } from '../../components/NotifyPopup';
import { globalContent } from '../../store/GlobalContent';
import Error from '../Error';
import Calendar from '../components/Calendar';
import Loader from '../components/Loader';
import { AddHp } from './AddHp';
import { HeaderTool } from './HeaderTool';
import { HocPhan } from './HocPhan';
import { ReName } from './ReName';
import style from './Tkb.module.scss';

export const cx = classNames.bind(style);

export interface GetTkbResp {
    code: number;
    msg: string;
    success: boolean;
    data?: TKB;
}

export interface TKB {
    id: string;
    name: string;
    tkb_describe: string;
    thumbnail?: any;
    ma_hoc_phans: string[];
    id_to_hocs: string[];
    rule: number;
    created: Date;
}

export interface DsNhomHocResp {
    ds_nhom_to: DsNhomTo[];
    ds_mon_hoc: { [key: string]: string };
}

export interface DsNhomTo {
    id_to_hoc: string;
    id_mon: string;
    ma_mon: string;
    ten_mon: string;
    so_tc: number;
    lop: Lop;
    ds_lop: Lop[];
    ds_khoa: Lop[];
    tkb: TkbTiet[];
}

export interface Lop {
    ma: string;
    ten: string;
}

export interface TkbTiet {
    thu: string;
    tbd: number;
    tkt: number;
    phong: string;
    gv: null | string;
    th: boolean;
}

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

    const [tkbData, setTkbData] = useState<TKB | undefined>();
    const [data, setData] = useState<DsNhomHocResp | undefined>();
    const cache = useRef<{ [key: string]: string }>({});
    const slotSelectedPeriod = useRef<Set<string>>(new Set());

    const [isLoading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    // const navigate = useNavigate();
    const { tkbid } = useParams();

    const addHp = (maHocPhan: string) => {
        setTkbData((e) => {
            if (!e) return e;
            if (tkbData?.ma_hoc_phans.includes(maHocPhan)) {
                var index = e?.ma_hoc_phans.indexOf(maHocPhan);
                e.ma_hoc_phans.splice(index, 1);
            } else e.ma_hoc_phans.push(maHocPhan);

            return { ...e };
        });
    };

    console.log(slotSelectedPeriod);

    const addNhomHoc = (idToHoc: string) => {
        const makeNewTkb = () => {
            if (!tkbData) return null;

            // lấy nhóm học và mã môn học
            var nhomhoc = data?.ds_nhom_to.find((j) => j.id_to_hoc === idToHoc);
            var ma_mon = nhomhoc?.ma_mon;
            if (!ma_mon || !nhomhoc) return null;

            // nếu môn đó đã chọn nhóm học thì xoá nhóm đó
            if (cache.current[ma_mon]) {
                var preIdToHoc = cache.current[ma_mon];
                var preNhomHoc = data?.ds_nhom_to.find((j) => j.id_to_hoc === preIdToHoc);

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

            // nếu có boá lỗi
            if (overlap) {
                console.info('Tiết bọ chùng', overlap);
                NotifyMaster.error('Chùng tiết với ' + overlap.gv + '. Thứ ' + overlap.thu + '. Tiết ' + overlap.tbd);
                return null;
            }

            // kiểm tra xem có khác cơ sử hay không
            // NOTE: không thể kiểm tra xem đúng hay sai
            // NOTE: Tại được
            var tietCacCoSo = checkIfDifferentLocation(nhomhoc.tkb, slotSelectedPeriod.current);
            if (tietCacCoSo) {
                NotifyMaster.error(
                    'Khác cơ sở tiêt ' + tietCacCoSo.gv + '. Thứ ' + tietCacCoSo.thu + '. Tiết ' + tietCacCoSo.tbd,
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

    const changeNameHandle = (s: string) => {
        setTkbData((e) => {
            if (!e) return e;
            e.name = s;
            return { ...e };
        });
    };

    useEffect(() => {
        if (searchParams.get('type') === 'local') {
            // tải từ máy tính
            // TODO:
            return;
        }

        // lấy dữ liệu từ server
        const getTkb = globalState.client.request.get<GetTkbResp>('/tkbs/' + tkbid);

        const getData = globalState.client.request.get<DsNhomHocResp>('/ds-nhom-hoc');

        Promise.all([getTkb, getData]).then((re) => {
            setLoading(false);
            console.log('getTkbRep', re[0]);
            console.log('getDsNhomHocRep', re[1]);

            const getTkbResp = re[0];

            if (!getTkbResp.data.success || !getTkbResp.data.data) {
                setErrMsg(getTkbResp.data.msg);
                return;
            }

            var tkbDataRep = getTkbResp.data.data;
            if (!tkbDataRep.id_to_hocs) tkbDataRep.id_to_hocs = [];
            if (!tkbDataRep.ma_hoc_phans) tkbDataRep.ma_hoc_phans = [];
            if (!tkbDataRep.tkb_describe) tkbDataRep.tkb_describe = '';
            tkbDataRep.created = new Date(tkbDataRep.created);

            // setup cache and slot
            var newCache: { [key: string]: string } = {};
            var newSlot: Set<string> = slotSelectedPeriod.current;
            tkbDataRep.id_to_hocs.forEach((e) => {
                var nhom = re[1].data.ds_nhom_to.find((j) => j.id_to_hoc === e);

                if (!nhom) return;

                // slot
                addSelectedPeriod(nhom.tkb, newSlot);

                // cache
                newCache[nhom.ma_mon] = e;
            });
            cache.current = newCache;
            slotSelectedPeriod.current = newSlot;

            setTkbData(tkbDataRep);

            setData(re[1].data);

            var tkbName = tkbDataRep.name;

            setHeaderPar((e) => {
                e.center = <ReName defaultName={tkbName} onChangeName={changeNameHandle} />;
                e.left = <HeaderTool />;
                e.right = <>users</>;

                return { ...e };
            });
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tkbid]);

    // send update tkb to server
    useEffect(() => {
        globalState.client.request.put('/tkbs/' + tkbid, tkbData).then((resp) => {
            console.log('save ok test');
        });
    }, [tkbData]);

    return (
        <Loader isLoading={isLoading}>
            {!errMsg ? (
                <div className={cx('wrapper')}>
                    <div className={cx('side-bar')}>
                        <div className={cx('side-bar-wrapper')}>
                            <div className={cx('header')}>
                                <p>Tính chỉ: 0/26</p>

                                <Popup trigger={<FontAwesomeIcon icon={faPlus} />} modal>
                                    <AddHp data={data} onAddHp={addHp} />
                                </Popup>
                            </div>

                            <div className={cx('content')}>
                                {tkbData?.ma_hoc_phans.map((e) => (
                                    <HocPhan
                                        data={data}
                                        maHocPhan={e}
                                        key={e}
                                        onAddNhomHoc={addNhomHoc}
                                        tkb={tkbData}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={cx('calendar-wrapper')}>
                        <Calendar data={data?.ds_nhom_to} idToHocs={tkbData?.id_to_hocs} />
                    </div>
                </div>
            ) : (
                <Error msg={errMsg} />
            )}
        </Loader>
    );
}

export default Tkb;
