import classNames from 'classnames/bind';

import { ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { headerContent } from '../../components/Layout/DefaultLayout';
import { NotifyMaster } from '../../components/NotifyPopup';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import { ApiResponse, DsNhomHocResp, DsNhomTo, TkbData, TkbTiet } from '../../Service';
import { globalContent } from '../../store/GlobalContent';
import { textSaveAsFile } from '../../utils';
import Calendar from '../components/Calendar';
import Loader from '../components/Loader';
import Error from '../Error';
import { HeaderTool } from './HeaderTool';
import { ReName } from './ReName';
import { ReplaceView, SelestionView } from './SelestionView';
import style from './Tkb.module.scss';

export const cx = classNames.bind(style);

interface eventTkb {
    type:
        | 'addHocPhan'
        | 'addNhomHoc'
        | 'removeHocPhan'
        | 'removeNhomHoc'
        | 'switchNhomHoc'
        | 'replayNhomHoc';
    valueId: string;
}

function tkbToKey(tkbs: TkbTiet[]): string {
    var temp: string[] = [];
    tkbs.forEach((e) => {
        var thu = e.thu;
        var cs = e.phong.substring(0, 1);

        for (let index = e.tbd; index <= e.tkt; index++) {
            const hash = `${thu}${index}|${cs}`;
            temp.push(hash);
        }
    });
    return temp.join('-');
}

export default function Tkb() {
    // context
    const setHeaderPar = useContext(headerContent);
    const [globalState] = useContext(globalContent);

    // state
    const [tkbData, setTkbData] = useState<TkbData>();
    const [dsNhomHoc, setDsNhomHoc] = useState<DsNhomHocResp>();
    const [soTC, setSoTC] = useState<number>(0);
    const [iconSaveing, setIconSaveing] = useState<'saved' | 'notsave' | 'saving'>('saved');
    const [errMsg, setErrMsg] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sideBar, setSideBar] = useState<string>('');
    const [replayIdToHoc, setReplayIdToHoc] = useState<string[]>([]);
    // ref
    const cacheMhpIdToHoc = useRef<{ [Key: string]: string }>({});
    const cacheTietNhom = useRef<{ [Key: string]: DsNhomTo }>({});
    const tkbDataRef = useRef<TkbData>();
    const idAutoSaveTimeOut = useRef<NodeJS.Timeout>();
    const timeLine = useRef<eventTkb[]>([]);

    // useParams
    const { tkbid } = useParams();
    const [searchParams] = useSearchParams();

    // funstion
    const getTkbData = async () => {
        if (!tkbid) {
            var resp: ApiResponse<TkbData> = {
                code: 500,
                msg: 'không tìm thấy Tkb',
                success: false,
            };

            return resp;
        }

        if (searchParams.get('isclient')) {
            return await globalState.client.localApi.getTkb(tkbid);
        }
        return await globalState.client.serverApi.getTkb(tkbid);
    };

    const getDsNhomHoc = async () => {
        return await globalState.client.serverApi.getDsNhomHoc();
    };

    const saveAsFile = () => {
        var a = tkbData?.id_to_hocs.map((e) => {
            var nhom = dsNhomHoc?.ds_nhom_to.find((j) => j.id_to_hoc === e);

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

    const onRenameHandler = (s: string) => {
        setTkbData((e) => {
            if (!e) return e;
            e.name = s;
            return { ...e };
        });
    };

    const onAddHphandler = useCallback(
        (mhp: string, isTimeLine?: boolean) => {
            if (tkbData && !tkbData.ma_hoc_phans.includes(mhp)) {
                tkbData.ma_hoc_phans.push(mhp);
                setTkbData({ ...tkbData });
                if (!isTimeLine) timeLine.current.push({ type: 'addHocPhan', valueId: mhp });
            }
        },
        [tkbData],
    );

    const onRemoveHphandeler = useCallback(
        (mhp: string, isTimeLine?: boolean) => {
            if (tkbData && tkbData?.ma_hoc_phans.includes(mhp)) {
                var index = tkbData.ma_hoc_phans.indexOf(mhp);
                tkbData.ma_hoc_phans.splice(index, 1);
                setTkbData({ ...tkbData });
                if (!isTimeLine) timeLine.current.push({ type: 'removeHocPhan', valueId: mhp });
            } else {
                console.log('hp không tồn tại trong ds hoặc tkb chưa tải xong');
            }
        },
        [tkbData],
    );

    const onRemoveNhomHocHandler = useCallback(
        (idToHoc: string, isTimeLine?: boolean) => {
            var nhom = dsNhomHoc?.ds_nhom_to.find((e) => e.id_to_hoc === idToHoc);
            if (tkbData && nhom && tkbData.id_to_hocs.includes(idToHoc)) {
                var index = tkbData.id_to_hocs.indexOf(idToHoc);
                tkbData.id_to_hocs.splice(index, 1);
                setTkbData({ ...tkbData });
                if (!isTimeLine) timeLine.current.push({ type: 'removeNhomHoc', valueId: idToHoc });

                delete cacheMhpIdToHoc.current[nhom.ma_mon];
                delete cacheTietNhom.current[tkbToKey(nhom.tkb)];
            }
        },
        [dsNhomHoc?.ds_nhom_to, tkbData],
    );

    const onAddNhomHocHandler = useCallback(
        (idToHoc: string, isTimeLine?: boolean, replay?: boolean) => {
            if (!tkbData) return;
            var nhom = dsNhomHoc?.ds_nhom_to.find((e) => e.id_to_hoc === idToHoc);

            if (!nhom) {
                console.error('không có nhóm học id: ' + idToHoc);
                NotifyMaster.error('không có nhóm học id: ' + idToHoc);
                return;
            }

            var maMon = nhom.ma_mon;

            var tiet = tkbToKey(nhom.tkb).split('-');

            var overlap = Object.keys(cacheTietNhom.current).filter((e) => {
                if (cacheTietNhom.current[e].ma_mon === maMon) return false;
                var i = false;

                tiet.forEach((j) => {
                    if (e.includes(j)) i = true;
                });

                return i;
            });

            var ov = overlap.map((e) => cacheTietNhom.current[e]);
            if (replay) {
                var tietString: string[] = [];
                tietString.push(idToHoc);

                ov.forEach((e) => {
                    tietString.push(e.id_to_hoc);
                    onRemoveNhomHocHandler(e.id_to_hoc, true);
                });

                if (cacheMhpIdToHoc.current[maMon]) {
                    tietString.push(cacheMhpIdToHoc.current[maMon]);
                    onRemoveNhomHocHandler(cacheMhpIdToHoc.current[maMon], true);
                }

                timeLine.current.push({ type: 'replayNhomHoc', valueId: tietString.join('|') });
                cacheMhpIdToHoc.current[maMon] = idToHoc;
                cacheTietNhom.current[tkbToKey(nhom.tkb)] = nhom;
                tkbData.id_to_hocs.push(idToHoc);
                setTkbData({ ...tkbData });
            } else {
                if (ov.length) {
                    console.log(ov);
                    NotifyMaster.error('Trùng tiết');
                    return;
                }

                if (cacheMhpIdToHoc.current[maMon]) {
                    if (!isTimeLine)
                        timeLine.current.push({
                            type: 'switchNhomHoc',
                            valueId: cacheMhpIdToHoc.current[maMon] + '|' + idToHoc,
                        });
                    onRemoveNhomHocHandler(cacheMhpIdToHoc.current[maMon], true);
                } else {
                    if (!isTimeLine)
                        timeLine.current.push({ type: 'addNhomHoc', valueId: idToHoc });
                }

                cacheMhpIdToHoc.current[maMon] = idToHoc;
                cacheTietNhom.current[tkbToKey(nhom.tkb)] = nhom;
                tkbData.id_to_hocs.push(idToHoc);
                setTkbData({ ...tkbData });
            }
        },
        [dsNhomHoc?.ds_nhom_to, onRemoveNhomHocHandler, tkbData],
    );

    const timNhomHocTuongTuHandel = (idToHocs: string[]) => {
        setSideBar('tutu');
        setReplayIdToHoc(idToHocs);
    };

    const doUpdate = () => {
        // console.log(tkbDateRef.current);
        console.log('dosave');
        if (!tkbDataRef.current) return;
        if (tkbDataRef.current?.isClient) {
            setIconSaveing('saving');
            globalState.client.localApi.updateTkb(tkbDataRef.current).then((apiresp) => {
                setIconSaveing('saved');
                if (apiresp.success) {
                    console.log('lưu thành công');
                } else {
                    notifyMaster.error(apiresp.msg);
                }
            });
        } else if (globalState.client.islogin() && tkbid) {
            setIconSaveing('saving');
            globalState.client.serverApi.updateTkb(tkbDataRef.current).then((apiresp) => {
                setIconSaveing('saved');
                if (apiresp.success) {
                    console.log('lưu thành công');
                } else {
                    notifyMaster.error(apiresp.msg);
                }
            });
        }
    };

    // event handle
    useEffect(() => {
        const check = (e: KeyboardEvent) => {
            if (e.keyCode === 90 && e.ctrlKey) {
                const event = timeLine.current.pop();

                console.log(timeLine.current);
                console.log(event);
                if (!event) return;
                switch (event.type) {
                    case 'addHocPhan':
                        onRemoveHphandeler(event.valueId, true);
                        break;

                    case 'addNhomHoc':
                        onRemoveNhomHocHandler(event.valueId, true);
                        break;

                    case 'removeHocPhan':
                        onAddHphandler(event.valueId, true);
                        break;

                    case 'removeNhomHoc':
                        onAddNhomHocHandler(event.valueId, true);
                        break;
                    case 'switchNhomHoc':
                        onAddNhomHocHandler(event.valueId.split('|')[0], true);
                        break;

                    case 'replayNhomHoc':
                        var [a, ...b] = event.valueId.split('|');
                        console.log(a, b);
                        onRemoveNhomHocHandler(a, true);
                        b.forEach((e) => {
                            onAddNhomHocHandler(e, true);
                        });
                }
            }
        };

        document.addEventListener('keydown', check);

        return () => {
            document.removeEventListener('keydown', check);
        };
    }, [onAddHphandler, onAddNhomHocHandler, onRemoveHphandeler, onRemoveNhomHocHandler]);

    // getTkbData và dsNhomHoc
    useEffect(() => {
        Promise.all([getTkbData(), getDsNhomHoc()]).then(([tkbDataResp, dsNhomHocResp]) => {
            console.log('getTkbRep', tkbDataResp);
            console.log('getDsNhomHocRep', dsNhomHocResp);

            setIsLoading(false);
            if (tkbDataResp.success) {
                setTkbData(tkbDataResp.data);
            } else {
                setErrMsg(tkbDataResp.msg);
                return;
            }

            setDsNhomHoc(dsNhomHocResp);
            tkbDataResp.data?.id_to_hocs.forEach((idToHoc) => {
                var nhomHoc = dsNhomHocResp.ds_nhom_to.find((e) => e.id_to_hoc === idToHoc);

                if (!nhomHoc) return;

                cacheMhpIdToHoc.current[nhomHoc.ma_mon] = idToHoc;
                var key = tkbToKey(nhomHoc.tkb);
                cacheTietNhom.current[key] = nhomHoc;

                console.log(cacheMhpIdToHoc, cacheTietNhom);
            });
        });

        return () => {
            doUpdate();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tkbid]);

    // updateHeader
    useEffect(() => {
        setHeaderPar((e) => {
            e.left = <HeaderTool saveAsFile={saveAsFile} />;
            e.right = <></>;
            var tkbName = tkbData?.name || '';
            e.center = (
                <ReName defaultName={tkbName} onChangeName={onRenameHandler} isSave={iconSaveing} />
            );
            return { ...e };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tkbData?.name, iconSaveing]);

    // auto save
    useEffect(() => {
        var sCT = 0;
        tkbData?.id_to_hocs.forEach((e) => {
            const nhom = dsNhomHoc?.ds_nhom_to.find((j) => j.id_to_hoc === e);
            if (nhom) sCT += nhom.so_tc;
        });

        setSoTC(sCT);

        if (!tkbDataRef.current) {
            tkbDataRef.current = tkbData;
            return;
        }
        setIconSaveing('notsave');
        tkbDataRef.current = tkbData;
        if (idAutoSaveTimeOut.current) clearTimeout(idAutoSaveTimeOut.current);
        idAutoSaveTimeOut.current = setTimeout(doUpdate, 5000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tkbData]);

    const sideBars: { [Key: string]: ReactNode } = {
        tutu: (
            <ReplaceView
                tkbData={tkbData}
                dsNhomHoc={dsNhomHoc}
                onAddNhomHoc={onAddNhomHocHandler}
                onRemoveNhomHoc={onRemoveNhomHocHandler}
                idNhomHocToReplace={replayIdToHoc}
                onClose={() => {
                    setSideBar('');
                }}
            />
        ),
    };

    // console.log(cacheMhpIdToHoc.current, cacheTietNhom.current);

    return (
        <Loader isLoading={isLoading}>
            {errMsg ? (
                <Error msg={errMsg} />
            ) : (
                <div className={cx('wrapper')}>
                    <div className={cx('side-bar')}>
                        {sideBars[sideBar] || (
                            <SelestionView
                                dsNhomHoc={dsNhomHoc}
                                onAddHp={onAddHphandler}
                                onRemoveHp={onRemoveHphandeler}
                                onRemoveNhomHoc={onRemoveNhomHocHandler}
                                onAddNhomHoc={onAddNhomHocHandler}
                                tkbData={tkbData}
                                soTC={soTC}
                            />
                        )}
                    </div>
                    <div className={cx('calendar-wrapper')}>
                        <Calendar
                            data={dsNhomHoc?.ds_nhom_to}
                            idToHocs={tkbData?.id_to_hocs}
                            onDeleteNhomHoc={onRemoveNhomHocHandler}
                            onTimMonHocTuTu={timNhomHocTuongTuHandel}
                        />
                    </div>
                </div>
            )}
        </Loader>
    );
}
