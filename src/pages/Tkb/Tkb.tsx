import classNames from 'classnames/bind';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import style from './Tkb.module.scss';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from 'reactjs-popup';
import { headerContent } from '../../components/Layout/DefaultLayout';
import { globalContent } from '../../store/GlobalContent';
import Error from '../Error';
import Calendar from '../components/Calendar';
import Loader from '../components/Loader';
import { HeaderTool } from './HeaderTool';
import { HocPhan } from './HocPhan';
import { ReName } from './ReName';

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

function AddHp() {
    return (
        <div className={cx('conten-menu-popup')}>
            <div className={cx('header')}>
                <h2>{}</h2>
            </div>
            <div className={cx('content')}>{}</div>
            <div className={cx('buttons')}>
                <button className={cx('cancel')}>Huỷ</button>
                <button className={cx('ok')}>ok</button>
            </div>
        </div>
    );
}

function Tkb() {
    const setHeaderPar = useContext(headerContent);
    const [globalState, setGlobalState] = useContext(globalContent);

    const [tkbData, setTkbData] = useState<TKB | undefined>();
    const [data, setData] = useState<DsNhomHocResp | undefined>();
    const cache = useRef<{ [key: string]: string }>({});

    const [isLoading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState('');

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { tkbid } = useParams();

    console.log(tkbData);

    const addHp = (maHocPhan: string) => {
        setTkbData((e) => {
            if (!e) return e;
            e?.ma_hoc_phans.push(maHocPhan);
            return { ...e };
        });
    };

    const addNhomHoc = (idToHoc: string) => {
        if (tkbData?.id_to_hocs.includes(idToHoc)) return;
        setTkbData((e) => {
            if (!e) return;
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
            if (getTkbResp.data.success) setTkbData(getTkbResp.data.data);
            else setErrMsg(getTkbResp.data.msg);

            setData(re[1].data);

            var newCache = {};

            getTkbResp.data.data.id_to_hocs.forEach((e) => {
                var nhom = re[1].data.ds_nhom_to.find((j) => j.id_to_hoc === e);
            });

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
                                    <AddHp />
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
