import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import style from './Tkb.module.scss';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { headerContent } from '../../components/Layout/DefaultLayout';
import { globalContent } from '../../store/GlobalContent';
import Calendar from '../components/Calendar';
import Loader from '../components/Loader';
import Error from '../Error';
import { HeaderTool } from './HeaderTool';
import { HocPhan } from './HocPhan';
import { ReName } from './ReName';
import Popup from 'reactjs-popup';
import { AddHp } from './AddHp';

export const cx = classNames.bind(style);

export interface GetTkbResp {
    code: number;
    msg: string;
    success: boolean;
    data: TKB;
}

export interface TKB {
    id: string;
    name: string;
    tkb_describe: string;
    thumbnail?: any;
    ma_hoc_phans: string[];
    id_to_hocs: string[];
    rule: number;
    created: string;
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
    tkb: Tkb[];
}

export interface Lop {
    ma: string;
    ten: string;
}

export interface Tkb {
    thu: string;
    tbd: number;
    tkt: number;
    phong: string;
    gv: null | string;
    th: boolean;
}

function Tkb() {
    const setHeaderPar = useContext(headerContent);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [globalState, setGlobalState] = useContext(globalContent);

    const [tkbData, setTkbData] = useState<TKB | undefined>();
    const [data, setData] = useState<DsNhomHocResp | undefined>();
    const cache = useRef<{ [key: string]: string }>({});

    const [isLoading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { tkbid } = useParams();

    console.log(tkbData);

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

    const addNhomHoc = (idToHoc: string) => {
        setTkbData((e) => {
            if (!e) return;

            // lấy mã môn học của nhóm đó
            var ma_mon = data?.ds_nhom_to.find((j) => j.id_to_hoc === idToHoc)?.ma_mon;
            if (!ma_mon) return;

            var isExit = tkbData?.id_to_hocs.includes(idToHoc);

            // nếu môn đó đã có nếu có thì xóa
            if (cache.current[ma_mon]) {
                var index = e.id_to_hocs.indexOf(cache.current[ma_mon]);
                if (index >= 0) e.id_to_hocs.splice(index, 1);
            }

            // neu da chon ma nham them lan nua la bo
            if (isExit) {
                cache.current[ma_mon] = '';
                return { ...e };
            }

            // thêm cái mới vào
            cache.current[ma_mon] = idToHoc;
            e.id_to_hocs.push(idToHoc);
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
            console.log(re);

            const getTkbResp = re[0];

            if (!getTkbResp.data.success) {
                setErrMsg(getTkbResp.data.msg);
                return;
            }

            // setup cache
            var newCache: { [key: string]: string } = {};
            getTkbResp.data.data.id_to_hocs.forEach((e) => {
                var nhom = re[1].data.ds_nhom_to.find((j) => j.id_to_hoc === e);

                if (!nhom) return;

                newCache[nhom.ma_mon] = e;
            });
            cache.current = newCache;

            setTkbData(getTkbResp.data.data);

            setData(re[1].data);

            setHeaderPar((e) => {
                e.center = <ReName defaultName={getTkbResp.data.data.name} />;
                e.left = <HeaderTool />;
                e.right = <>users</>;

                return { ...e };
            });
        });
    }, [tkbid]);

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
                                    <HocPhan data={data} maHocPhan={e} key={e} onAddNhomHoc={addNhomHoc} />
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
