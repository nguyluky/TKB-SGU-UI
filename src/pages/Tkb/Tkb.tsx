import classNames from 'classnames/bind';
import { ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { headerContent } from '../../components/Layout/DefaultLayout';
import { NotifyMaster } from '../../components/NotifyPopup';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import { ApiResponse, DsNhomHocResp, DsNhomTo, TkbData, TkbTiet } from '../../Service';
import { globalContent } from '../../store/GlobalContent';
import { textSaveAsFile } from '../../utils';
import Calendar from '../components/Calendar';
import Loader from '../components/Loader';
import { CloneTkb, CreateNewTkb, Property, UploadTkb } from '../components/PagesPopup';
import { Convert } from '../DsTkb/FileTkb';
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
            const hash = `${thu},${index}|${cs}`;
            temp.push(hash);
        }
    });
    return temp.join('-');
}

export default function Tkb() {
    const nav = useNavigate();

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
    const [conflict, setConflict] = useState<string[]>([]);
    const [popup, setPopup] = useState<ReactNode>();
    // ref
    const cacheMhpIdToHoc = useRef<{ [Key: string]: string }>({});
    const cacheTietNhom = useRef<{ [Key: string]: DsNhomTo }>({});
    const tkbDataRef = useRef<TkbData>();
    const idAutoSaveTimeOut = useRef<NodeJS.Timeout>();
    const undoTimeLine = useRef<eventTkb[]>([]);
    const redoTimeLine = useRef<eventTkb[]>([]);

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

    const onRenameHandler = (s: string) => {
        setTkbData((e) => {
            if (!e) return e;
            e.name = s;
            return { ...e };
        });
    };

    const onCreateTkbHandler = (name: string, pos: string) => {
        (pos === 'client' ? globalState.client.localApi : globalState.client.serverApi)
            .createNewTkb(name, '', null, false)
            .then((e) => {
                if (!e.success) {
                    notifyMaster.error(e.msg);
                    return;
                }

                nav('/tkbs/' + e.data?.id + (e.data?.isClient ? '?isclient=true' : ''));
                notifyMaster.success('Tạo tkb thành công');
            })
            .catch((e) => {
                notifyMaster.success('Không thể kết tạo tkb không biết lý do');
            });
    };

    const onUploadTkbHandler = (file: File, pos: string) => {
        const reader = new FileReader();

        reader.readAsText(file, 'utf-8');

        reader.onload = () => {
            if (!reader.result) return;
            try {
                var fileTkb = Convert.toFileTkb(reader.result as string);

                (pos === 'client' ? globalState.client.localApi : globalState.client.serverApi)
                    .createNewTkb(
                        fileTkb.name,
                        '',
                        null,
                        false,
                        fileTkb.data.map((e) => e.id_to_hoc),
                        fileTkb.data.map((e) => e.mhp),
                    )
                    .then((e) => {
                        if (!e.success) {
                            notifyMaster.error(e.msg);
                            return;
                        }

                        nav('/tkbs/' + e.data?.id + (e.data?.isClient ? '?isclient=true' : ''));
                        notifyMaster.success('Upload tkb thành công');
                    })
                    .catch((e) => {
                        notifyMaster.success('Không thể kết upload tkb không biết lý do');
                    });
            } catch {
                notifyMaster.error('Format file không hợp lệ');
            }
        };
    };

    const onAddHphandler = useCallback(
        (mhp: string, isTimeLine?: boolean) => {
            if (!tkbData || tkbData.ma_hoc_phans.includes(mhp)) {
                notifyMaster.info('tkb chưa tải xong');
                return;
            }

            if (tkbData.rule >= 3) {
                notifyMaster.error('bạn không có quyền sửa tkb này');
                return;
            }

            tkbData.ma_hoc_phans.push(mhp);
            setTkbData({ ...tkbData });
            if (!isTimeLine) {
                undoTimeLine.current.push({ type: 'addHocPhan', valueId: mhp });
                redoTimeLine.current = [];
            }
        },
        [tkbData],
    );

    const onRemoveNhomHocHandler = useCallback(
        (idToHoc: string, isTimeLine?: boolean) => {
            var nhom = dsNhomHoc?.ds_nhom_to.find((e) => e.id_to_hoc === idToHoc);
            if (!tkbData || !nhom || !tkbData.id_to_hocs.includes(idToHoc)) return;

            var index = tkbData.id_to_hocs.indexOf(idToHoc);
            tkbData.id_to_hocs.splice(index, 1);
            setTkbData({ ...tkbData });
            if (!isTimeLine) {
                undoTimeLine.current.push({ type: 'removeNhomHoc', valueId: idToHoc });
                redoTimeLine.current = [];
            }
            delete cacheMhpIdToHoc.current[nhom.ma_mon];
            delete cacheTietNhom.current[tkbToKey(nhom.tkb)];
        },
        [dsNhomHoc?.ds_nhom_to, tkbData],
    );

    const onRemoveHphandeler = useCallback(
        (mhp: string, isTimeLine?: boolean) => {
            if (!tkbData || !tkbData?.ma_hoc_phans.includes(mhp)) {
                console.log('hp không tồn tại trong ds hoặc tkb chưa tải xong');
                return;
            }

            var index = tkbData.ma_hoc_phans.indexOf(mhp);
            tkbData.ma_hoc_phans.splice(index, 1);
            if (cacheMhpIdToHoc.current[mhp]) onRemoveNhomHocHandler(cacheMhpIdToHoc.current[mhp]);
            if (!isTimeLine) {
                undoTimeLine.current.push({ type: 'removeHocPhan', valueId: mhp });
                redoTimeLine.current = [];
            }
            setTkbData({ ...tkbData });
        },
        [onRemoveNhomHocHandler, tkbData],
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

            var tiet = tkbToKey(nhom.tkb)
                .split('-')
                .map((e) => e.split('|')[0]);

            var overlapKey = Object.keys(cacheTietNhom.current).filter((e) => {
                if (cacheTietNhom.current[e].ma_mon === maMon) return false;
                var i = false;

                var t = e.split('-').map((j) => j.split('|')[0]);

                tiet.forEach((j) => {
                    if (t.includes(j)) i = true;
                });

                return i;
            });
            var ov = overlapKey.map((e) => cacheTietNhom.current[e]);

            // kiểm tra khác cơ sở
            var tem: { [Key: string]: string } = {};
            tkbToKey(nhom.tkb)
                .split('-')
                .forEach((e) => {
                    console.log(e);

                    const [ThT, CS] = e.split('|');
                    const [Thu, t] = ThT.split(',');

                    var hash = Thu + (+t <= 5 ? 's' : 'c');
                    tem[hash] = CS;
                });

            console.log(tem);

            var khacCSKey = Object.keys(cacheTietNhom.current).filter((key) => {
                if (cacheTietNhom.current[key].ma_mon === maMon) return false;
                var isTrung = false;
                key.split('-').forEach((e) => {
                    const [ThT, CS] = e.split('|');
                    const [Thu, t] = ThT.split(',');

                    var hash = Thu + (+t <= 5 ? 's' : 'c');
                    console.log(tem[hash]);
                    if (tem[hash] && tem[hash] !== CS) {
                        isTrung = true;
                    }
                });

                return isTrung;
            });

            var khacCS = khacCSKey.map((e) => cacheTietNhom.current[e]);

            // console.log(khacCS);

            if (replay) {
                var tietString: string[] = [];
                tietString.push(idToHoc);

                khacCS.forEach((e) => {
                    tietString.push(e.id_to_hoc);
                    onRemoveNhomHocHandler(e.id_to_hoc, true);
                });

                ov.forEach((e) => {
                    tietString.push(e.id_to_hoc);
                    onRemoveNhomHocHandler(e.id_to_hoc, true);
                });

                if (cacheMhpIdToHoc.current[maMon]) {
                    tietString.push(cacheMhpIdToHoc.current[maMon]);
                    onRemoveNhomHocHandler(cacheMhpIdToHoc.current[maMon], true);
                }

                undoTimeLine.current.push({ type: 'replayNhomHoc', valueId: tietString.join('|') });
                cacheMhpIdToHoc.current[maMon] = idToHoc;
                cacheTietNhom.current[tkbToKey(nhom.tkb)] = nhom;
                tkbData.id_to_hocs.push(idToHoc);
                setTkbData({ ...tkbData });
            } else {
                if (khacCS.length) {
                    console.log(khacCS);
                    NotifyMaster.error(`khác cơ sở ${ov.map((e) => e.ten_mon).join(' - ')}`);
                    setConflict((e) => {
                        khacCS.forEach((j) => {
                            if (!e.includes(j.id_to_hoc)) e.push(j.id_to_hoc);
                        });
                        return [...e];
                    });
                    setTimeout(() => {
                        console.log('ok');

                        setConflict((e) => {
                            khacCS.forEach((j) => {
                                var m = j.id_to_hoc;
                                var i = e.indexOf(m);
                                if (i >= 0) e.splice(i, 1);
                            });

                            return [...e];
                        });
                    }, 500);
                    return;
                }

                if (ov.length) {
                    console.log(ov);
                    // ông xem nên để cái thông báo lỗi như thế nào cho hợi lý

                    NotifyMaster.error(`Trùng tiết ${ov.map((e) => e.ten_mon).join(' - ')}`);
                    setConflict((e) => {
                        ov.forEach((j) => {
                            if (!e.includes(j.id_to_hoc)) e.push(j.id_to_hoc);
                        });
                        return [...e];
                    });
                    setTimeout(() => {
                        console.log('ok');
                        setConflict((e) => {
                            ov.forEach((j) => {
                                var m = j.id_to_hoc;
                                var i = e.indexOf(m);
                                if (i >= 0) e.splice(i, 1);
                            });

                            return [...e];
                        });
                    }, 500);
                    return;
                }

                if (cacheMhpIdToHoc.current[maMon]) {
                    if (!isTimeLine) {
                        undoTimeLine.current.push({
                            type: 'switchNhomHoc',
                            valueId: cacheMhpIdToHoc.current[maMon] + '|' + idToHoc,
                        });
                        redoTimeLine.current = [];
                    }
                    onRemoveNhomHocHandler(cacheMhpIdToHoc.current[maMon], true);
                } else if (!isTimeLine) {
                    redoTimeLine.current = [];
                    undoTimeLine.current.push({ type: 'addNhomHoc', valueId: idToHoc });
                }

                cacheMhpIdToHoc.current[maMon] = idToHoc;
                cacheTietNhom.current[tkbToKey(nhom.tkb)] = nhom;
                tkbData.id_to_hocs.push(idToHoc);
                setTkbData({ ...tkbData });
            }
        },
        [dsNhomHoc?.ds_nhom_to, onRemoveNhomHocHandler, tkbData],
    );

    const commands: { [Key: string]: Function } = {
        new: () => {
            console.log('ok');
            setPopup(
                <CreateNewTkb
                    open={true}
                    onClose={() => {
                        setPopup('');
                    }}
                    onCreate={onCreateTkbHandler}
                />,
            );
        },
        saveAsFile: () => {
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
        },
        open: () => {
            setPopup(
                <UploadTkb
                    open={true}
                    onClose={() => {
                        setPopup('');
                    }}
                    uploadTkb={(file, pos) => {
                        setPopup('');
                        onUploadTkbHandler(file, pos);
                    }}
                />,
            );
        },
        undo: () => {
            const event = undoTimeLine.current.pop();
            console.log(event);
            if (!event) return;
            redoTimeLine.current.push(event);
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
        },
        redo: () => {
            const event = redoTimeLine.current.pop();
            console.log(event);
            if (!event) return;
            undoTimeLine.current.push(event);
            switch (event.type) {
                case 'addHocPhan':
                    onAddHphandler(event.valueId, true);
                    break;

                case 'addNhomHoc':
                    onAddNhomHocHandler(event.valueId, true);
                    break;

                case 'removeHocPhan':
                    onRemoveHphandeler(event.valueId, true);
                    break;

                case 'removeNhomHoc':
                    onRemoveNhomHocHandler(event.valueId, true);
                    break;
                case 'switchNhomHoc':
                    onAddNhomHocHandler(event.valueId.split('|')[1], true);
                    break;
            }
        },
        exit: () => {
            nav('/tkbs');
        },
        clone: () => {
            setPopup(
                <CloneTkb
                    open={true}
                    onClose={() => {
                        setPopup('');
                    }}
                    onClone={(name, pos) => {
                        (pos === 'client'
                            ? globalState.client.localApi
                            : globalState.client.serverApi
                        )
                            .createNewTkb(
                                name,
                                '',
                                null,
                                false,
                                tkbData?.id_to_hocs || [],
                                tkbData?.ma_hoc_phans || [],
                            )
                            .then((e) => {
                                if (!e.success) {
                                    notifyMaster.error(e.msg);
                                    return;
                                }

                                window.open(
                                    window.location.origin +
                                        '/tkbs/' +
                                        e.data?.id +
                                        (e.data?.isClient ? '?isclient=true' : ''),
                                );
                            })
                            .catch((e) => {
                                notifyMaster.success('Tạo bản sao tkb không biết lý do');
                            });
                    }}
                />,
            );
        },
        property: () => {
            if (tkbData)
                setPopup(
                    <Property open={true} tkbData={tkbData} onClose={() => setPopup('')} modal />,
                );
        },
    };

    const timNhomHocTuongTuHandel = (idToHocs: string[]) => {
        console.log(idToHocs);
        setSideBar('tutu');
        setReplayIdToHoc(idToHocs);
    };

    const doUpdate = () => {
        // console.log(tkbDateRef.current);
        console.log('dosave');

        if (!tkbDataRef.current) return;

        if (tkbDataRef.current.rule >= 3) return;

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

    const onCommandHandel = (command: string) => {
        const funs = commands[command];
        if (!funs) {
            notifyMaster.error('chưa làm =) : ' + command);
            return;
        }
        funs();
        console.log(command);
    };

    // event handle
    useEffect(() => {
        const keyEventHandel = (e: KeyboardEvent) => {
            if (e.keyCode === 90 && e.ctrlKey) {
                commands['undo']();
            } else if (e.keyCode === 89 && e.ctrlKey) {
                commands['redo']();
            }
            // console.log(e);
        };

        document.addEventListener('keydown', keyEventHandel);

        return () => {
            document.removeEventListener('keydown', keyEventHandel);
        };
    }, [onAddHphandler, onAddNhomHocHandler, onRemoveHphandeler, onRemoveNhomHocHandler]);

    // getTkbData và dsNhomHoc
    useEffect(() => {
        Promise.all([getTkbData(), getDsNhomHoc()]).then(([tkbDataResp, dsNhomHocResp]) => {
            console.log('getTkbRep', tkbDataResp);
            console.log('getDsNhomHocRep', dsNhomHocResp);

            setIsLoading(false);

            if (!tkbDataResp.success || !tkbDataResp.data) {
                setErrMsg(tkbDataResp.msg || 'lỗi không thể lấy thời khóa biểu');
                return;
            }
            setTkbData(tkbDataResp.data);
            setDsNhomHoc(dsNhomHocResp);
            tkbDataResp.data?.id_to_hocs.forEach((idToHoc) => {
                var nhomHoc = dsNhomHocResp.ds_nhom_to.find((e) => e.id_to_hoc === idToHoc);

                if (!nhomHoc) return;

                cacheMhpIdToHoc.current[nhomHoc.ma_mon] = idToHoc;
                var key = tkbToKey(nhomHoc.tkb);
                cacheTietNhom.current[key] = nhomHoc;
            });
        });

        return () => {
            doUpdate();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tkbid]);

    // updateHeader
    useEffect(() => {
        if (!tkbData) return;
        setHeaderPar((e) => {
            e.left = <HeaderTool onCommandEvent={onCommandHandel} />;
            e.right = undefined;
            var tkbName = tkbData?.name || '';
            e.center = (
                <ReName
                    defaultName={tkbName}
                    onChangeName={onRenameHandler}
                    isSave={iconSaveing}
                    isReadOnly={tkbData.rule >= 3}
                />
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
                            conflict={conflict}
                            data={dsNhomHoc?.ds_nhom_to}
                            idToHocs={tkbData?.id_to_hocs}
                            onDeleteNhomHoc={onRemoveNhomHocHandler}
                            onTimMonHocTuTu={timNhomHocTuongTuHandel}
                        />
                    </div>

                    {popup}
                </div>
            )}
        </Loader>
    );
}
