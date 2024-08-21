import classNames from 'classnames/bind';
import { ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { headerContent } from '../../components/Layout/DefaultLayout';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import useSelection from '../../Hooks/useSelection';
import useTkbHandler from '../../Hooks/useTkbHandler';
import useTkbSocket from '../../Hooks/useTkbSocket';
import { globalContent } from '../../store/GlobalContent';
import { textSaveAsFile } from '../../utils';
import Calendar from '../components/Calendar';
import Loader from '../components/Loader';
import { CloneTkb, CreateNewTkb, Property, UploadTkb } from '../components/PagesPopup';
import { SharePopup } from '../components/PagesPopup/PagesPopup';
import { Convert } from '../DsTkb/FileTkb';
import Error from '../Error';
import { HeaderTool } from './HeaderTool';
import { ReName } from './ReName';
import { ReplaceView, SelestionView } from './SelestionView';
import style from './Tkb.module.scss';

export const cx = classNames.bind(style);

export interface commandsInterface {
    new?: () => void;
    saveAsFile?: () => void;
    open?: () => void;
    undo?: () => void;
    redo?: () => void;
    exit?: () => void;
    clone?: () => void;
    addMember?: () => void;
    property?: () => void;
    cut?: () => void;
    past?: () => void;
    manageMenber?: () => void;
}

export default function Tkb() {
    const nav = useNavigate();

    // context
    const setHeaderPar = useContext(headerContent);
    const [globalState] = useContext(globalContent);

    // useParams
    const { tkbid } = useParams();
    const [searchParams] = useSearchParams();

    // tkb data
    const [replayIdToHoc, setReplayIdToHoc] = useState<string[]>([]);
    const [soTC, setSoTC] = useState<number>(-1);

    // state
    const [sideBar, setSideBar] = useState<string>('');
    const [popup, setPopup] = useState<ReactNode>();
    const selection = useSelection();

    // ref

    const idAutoSaveTimeOut = useRef<NodeJS.Timeout>();

    const tkbHandler = useTkbHandler(tkbid || '', !!searchParams.get('isclient'));
    useTkbSocket(
        tkbHandler.onAddHphandler,
        tkbHandler.onAddNhomHocHandler,
        tkbHandler.onRemoveHphandeler,
        tkbHandler.onRemoveNhomHocHandler,
    );

    const timNhomHocTuongTuHandel = (idToHocs: string[]) => {
        console.log(idToHocs);
        setSideBar('tutu');
        setReplayIdToHoc(idToHocs);
    };

    const commands = useCallback(
        (key: keyof commandsInterface) => {
            const onUploadTkbHandler = (file: File, pos: string) => {
                const reader = new FileReader();

                reader.readAsText(file, 'utf-8');

                reader.onload = () => {
                    if (!reader.result) return;
                    try {
                        const fileTkb = Convert.toFileTkb(reader.result as string);

                        (pos === 'client'
                            ? globalState.client.localApi
                            : globalState.client.serverApi
                        )
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

                                nav(
                                    '/tkbs/' +
                                        e.data?.id +
                                        (e.data?.isClient ? '?isclient=true' : ''),
                                );
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

            const commandObj: commandsInterface = {
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
                    const a = tkbHandler.tkbData?.id_to_hocs.map((e) => {
                        const nhom = tkbHandler.dsNhomHoc?.ds_nhom_to.find(
                            (j) => j.id_to_hoc === e,
                        );

                        return {
                            mhp: nhom?.ma_mon,
                            ten: nhom?.ten_mon,
                            nhom: '?',
                            id_to_hoc: e,
                        };
                    });

                    const textFile = {
                        name: tkbHandler.tkbData?.name,
                        created: tkbHandler.tkbData?.created.toString(),
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
                    const event = tkbHandler.undoTimeLine.current.pop();
                    console.log(event);
                    if (!event) return;
                    tkbHandler.redoTimeLine.current.push(event);
                    switch (event.type) {
                        case 'addHocPhan':
                            tkbHandler.onRemoveHphandeler(event.valueId, true);
                            break;

                        case 'addNhomHoc':
                            tkbHandler.onRemoveNhomHocHandler(event.valueId, true);
                            break;

                        case 'removeHocPhan':
                            tkbHandler.onAddHphandler(event.valueId, true);
                            break;

                        case 'removeNhomHoc':
                            tkbHandler.onAddNhomHocHandler(event.valueId, true);
                            break;
                        case 'switchNhomHoc':
                            tkbHandler.onAddNhomHocHandler(event.valueId.split('|')[0], true);
                            break;

                        case 'replayNhomHoc':
                            const [a, ...b] = event.valueId.split('|');
                            console.log(a, b);
                            tkbHandler.onRemoveNhomHocHandler(a, true);
                            b.forEach((e) => {
                                tkbHandler.onAddNhomHocHandler(e, true);
                            });
                    }
                },
                redo: () => {
                    const event = tkbHandler.redoTimeLine.current.pop();
                    console.log(event);
                    if (!event) return;
                    tkbHandler.undoTimeLine.current.push(event);
                    switch (event.type) {
                        case 'addHocPhan':
                            tkbHandler.onAddHphandler(event.valueId, true);
                            break;

                        case 'addNhomHoc':
                            tkbHandler.onAddNhomHocHandler(event.valueId, true);
                            break;

                        case 'removeHocPhan':
                            tkbHandler.onRemoveHphandeler(event.valueId, true);
                            break;

                        case 'removeNhomHoc':
                            tkbHandler.onRemoveNhomHocHandler(event.valueId, true);
                            break;
                        case 'switchNhomHoc':
                            tkbHandler.onAddNhomHocHandler(event.valueId.split('|')[1], true);
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
                                console.log(
                                    tkbHandler.tkbData?.id_to_hocs,
                                    tkbHandler.tkbData?.ma_hoc_phans,
                                );

                                (pos === 'client'
                                    ? globalState.client.localApi
                                    : globalState.client.serverApi
                                )
                                    .createNewTkb(
                                        name,
                                        '',
                                        null,
                                        false,
                                        tkbHandler.tkbData?.id_to_hocs || [],
                                        tkbHandler.tkbData?.ma_hoc_phans || [],
                                    )
                                    .then((e) => {
                                        if (!e.success || !e.data) {
                                            notifyMaster.error(e.msg);
                                            return;
                                        }

                                        const newData = e.data;

                                        newData.id_to_hocs = tkbHandler.tkbData?.id_to_hocs || [];
                                        newData.ma_hoc_phans =
                                            tkbHandler.tkbData?.ma_hoc_phans || [];

                                        (pos === 'client'
                                            ? globalState.client.localApi
                                            : globalState.client.serverApi
                                        )
                                            .updateTkb(newData)
                                            .then((j) => {
                                                window.open(
                                                    window.location.origin +
                                                        '/tkbs/' +
                                                        e.data?.id +
                                                        (e.data?.isClient ? '?isclient=true' : ''),
                                                );
                                            });
                                    })
                                    .catch((e) => {
                                        notifyMaster.success('Tạo bản sao tkb không biết lý do');
                                    });
                            }}
                        />,
                    );
                },
                addMember: () => {
                    if (tkbHandler.tkbData) {
                        if (tkbHandler.tkbData.isClient) {
                            notifyMaster.error(
                                'không thể chia sẻ tkb client, sạo bản sao phía server rồi thử lại nha.',
                            );
                            return;
                        }
                        setPopup(
                            <SharePopup
                                tkbid={tkbid || ''}
                                open={true}
                                modal
                                onClose={() => setPopup('')}
                            ></SharePopup>,
                        );
                    }
                },
                property: () => {
                    if (tkbHandler.tkbData)
                        setPopup(
                            <Property
                                open={true}
                                tkbData={tkbHandler.tkbData}
                                onClose={() => setPopup('')}
                                modal
                            />,
                        );
                },
            };
            return commandObj[key];
        },
        [globalState.client.localApi, globalState.client.serverApi, nav, tkbHandler, tkbid],
    );

    const onCommandHandel = useCallback(
        (command: keyof commandsInterface) => {
            console.log('reload');

            const funs = commands(command);
            if (!funs) {
                notifyMaster.error('chưa làm =) : ' + command);
                return;
            }
            funs();
            console.log(command);
        },
        [commands],
    );

    // event handle
    useEffect(() => {
        const keyEventHandel = (e: KeyboardEvent) => {
            if (e.keyCode === 90 && e.ctrlKey) {
                const command = commands('undo');
                if (command) command();
            } else if (e.keyCode === 89 && e.ctrlKey) {
                const command = commands('redo');
                if (command) command();
            } else if (e.keyCode === 65 && e.ctrlKey) {
                selection.addAll(tkbHandler.tkbData?.id_to_hocs || []);
                // tkbHandler.tkbData?.id_to_hocs.forEach((e) => {
                //     selection.addSelection(e);
                // });
            }
            if (e.keyCode === 27) {
                console.log('clear');
                if (!selection.selection) selection.clear();
            }

            if (e.keyCode === 46) {
                if (!selection.selection) return;
                [...selection.selection].forEach((e) => {
                    tkbHandler.onRemoveNhomHocHandler(e);
                });
                selection.clear();
            }

            console.log(e);
        };

        document.addEventListener('keydown', keyEventHandel);

        return () => {
            document.removeEventListener('keydown', keyEventHandel);
        };
    }, [commands, selection, tkbHandler, tkbHandler.tkbData?.id_to_hocs]);

    // updateHeader
    useEffect(() => {
        const tkbTemp = tkbHandler.tkbData;
        if (!tkbTemp) return;
        setHeaderPar((e) => {
            e.left = <HeaderTool onCommandEvent={onCommandHandel} />;
            e.right = undefined;
            const tkbName = tkbTemp?.name || '';
            e.center = (
                <ReName
                    defaultName={tkbName}
                    onChangeName={tkbHandler.onRenameHandler}
                    isSave={tkbHandler.iconSaveing}
                    isReadOnly={tkbTemp.rule >= 3}
                />
            );
            return { ...e };
        });
        // NOTE: có thể nỗi mai mốt
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHeaderPar, tkbHandler.tkbData?.name, tkbHandler.iconSaveing]);

    // auto save
    useEffect(() => {
        let sCT = 0;

        if (!tkbHandler.tkbData) return;
        const dsNhomHoc = tkbHandler.dsNhomHoc;
        if (!dsNhomHoc) return;

        tkbHandler.tkbData.id_to_hocs.forEach((e) => {
            const nhom = dsNhomHoc.ds_nhom_to.find((j) => j.id_to_hoc === e);
            if (nhom) sCT += nhom.so_tc;
        });

        console.log('why', soTC);
        if (soTC >= 0) {
            if (idAutoSaveTimeOut.current) clearTimeout(idAutoSaveTimeOut.current);
            idAutoSaveTimeOut.current = setTimeout(tkbHandler.doUpdate, 5000);
        }
        setSoTC(sCT);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tkbHandler.doUpdate, tkbHandler.dsNhomHoc, tkbHandler.tkbData]);

    const sideBars: { [Key: string]: ReactNode } = {
        tutu: (
            <ReplaceView
                tkbData={tkbHandler.tkbData}
                dsNhomHoc={tkbHandler.dsNhomHoc}
                onAddNhomHoc={tkbHandler.onAddNhomHocHandler}
                onRemoveNhomHoc={tkbHandler.onRemoveNhomHocHandler}
                idNhomHocToReplace={replayIdToHoc}
                onClose={() => {
                    setSideBar('');
                }}
            />
        ),
    };

    return (
        <Loader isLoading={tkbHandler.isLoading}>
            {tkbHandler.errMsg ? (
                <Error msg={tkbHandler.errMsg} />
            ) : (
                <div className={cx('wrapper')}>
                    <div className={cx('side-bar')}>
                        {sideBars[sideBar] || (
                            <SelestionView
                                dsNhomHoc={tkbHandler.dsNhomHoc}
                                onAddHp={tkbHandler.onAddHphandler}
                                onRemoveHp={tkbHandler.onRemoveHphandeler}
                                onRemoveNhomHoc={tkbHandler.onRemoveNhomHocHandler}
                                onAddNhomHoc={tkbHandler.onAddNhomHocHandler}
                                tkbData={tkbHandler.tkbData}
                                soTC={soTC}
                            />
                        )}
                    </div>
                    <div className={cx('calendar-wrapper')}>
                        <Calendar
                            conflict={tkbHandler.conflict}
                            data={tkbHandler.dsNhomHoc?.ds_nhom_to}
                            idToHocs={tkbHandler.tkbData?.id_to_hocs}
                            onDeleteNhomHoc={(idToHoc: string) => {
                                tkbHandler.onRemoveNhomHocHandler(idToHoc);
                                selection.removeSelection(idToHoc);
                            }}
                            onTimMonHocTuTu={timNhomHocTuongTuHandel}
                            selection={selection}
                        />
                    </div>

                    {popup}
                </div>
            )}
        </Loader>
    );
}
