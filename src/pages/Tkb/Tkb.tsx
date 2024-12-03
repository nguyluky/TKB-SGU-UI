import classNames from 'classnames/bind';
import { ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';

import { useHotkeys } from 'react-hotkeys-hook';
import { headerContent } from '../../components/Layout/DefaultLayout';
import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import { apiConfig } from '../../config';
import useSelection from '../../Hooks/useSelection';
import useTkbHandler from '../../Hooks/useTkbHandler';
import useWindowPopup from '../../Hooks/useWindowPopup';
import { globalContent } from '../../store/GlobalContent';
import { textSaveAsFile } from '../../utils';
import Calendar from '../components/Calendar';
import Loader from '../components/Loader';
import { CloneTkb, CreateNewTkb, Property, Share, UploadTkb } from '../components/PagesPopup';
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
    googleCalendar?: () => void;
}

export default function Tkb() {
    const nav = useNavigate();

    // context
    const setHeaderPar = useContext(headerContent);
    const [globalState] = useContext(globalContent);

    // useParams
    const { tkbid } = useParams();
    const [searchParams] = useSearchParams();
    const windowPopup = useWindowPopup((event) => {
        const data = event.data;

        if (data.type === 'notify') {
            notifyMaster[data.data.notifyType](data.data.mess);
            windowPopup.close();
        }
    });

    // tkb data
    const [replayIdToHoc, setReplayIdToHoc] = useState<string[]>([]);
    const [soTC, setSoTC] = useState<number>(-1);

    // state
    const [sideBar, setSideBar] = useState<string>('');
    const [popup, setPopup] = useState<ReactNode>();
    const selection = useSelection();
    const [sideBarWidth, setSideBarWidth] = useState<number>(290);
    const [miniSide, setMintSide] = useState(false);
    const [isResize, setResize] = useState(false);

    const idAutoSaveTimeOut = useRef<NodeJS.Timeout>();

    const tkbHandler = useTkbHandler(tkbid || '', !!searchParams.get('isclient'));

    const isTabletOrMobile = useMediaQuery('(max-width: 800px)');

    // TODO: socket
    // useTkbSocket(
    //     tkbHandler.onAddHphandler,
    //     tkbHandler.onAddNhomHocHandler,
    //     tkbHandler.onRemoveHphandeler,
    //     tkbHandler.onRemoveNhomHocHandler,
    //     tkbHandler.onRenameHandler,
    // );

    const miniSideBar = () => {
        setMintSide((e) => !e);
    };

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
                        const api =
                            pos === 'client'
                                ? globalState.client.localApi
                                : globalState.client.serverApi;
                        api.createNewTkb({
                            name: fileTkb.name,
                            tkb_describe: '',
                            thumbnails: null,
                            isClient: pos === 'client',
                        })
                            .then(async (e) => {
                                if (!e.success || !e.data) {
                                    notifyMaster.error(e.msg);
                                    return;
                                }

                                await Promise.all([
                                    api.updateTkbContent(
                                        e.data.id,
                                        fileTkb.data.map((e) => e.id_to_hoc),
                                    ),
                                    api.updateTkbContentMmh(
                                        e.data.id,
                                        fileTkb.data.map((e) => e.mhp),
                                    ),
                                ]);

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
                    .createNewTkb({
                        name: name,
                        tkb_describe: '',
                        thumbnails: null,
                        isClient: pos === 'client',
                    })
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
                    const a = tkbHandler.id_to_hocs.map((e) => {
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
                                console.log(tkbHandler.id_to_hocs, tkbHandler.ma_hoc_phans);

                                const api =
                                    pos === 'client'
                                        ? globalState.client.localApi
                                        : globalState.client.serverApi;

                                api.createNewTkb(
                                    {
                                        name: name,
                                        tkb_describe: '',
                                        thumbnails: null,
                                    },
                                    // name,
                                    // '',
                                    // null,
                                    // false,
                                    // tkbHandler.tkbData?.id_to_hocs || [],
                                    // tkbHandler.tkbData?.ma_hoc_phans || [],
                                )
                                    .then(async (e) => {
                                        if (!e.success || !e.data) {
                                            notifyMaster.error(e.msg);
                                            return;
                                        }

                                        await Promise.all([
                                            api.updateTkbContent(e.data.id, tkbHandler.id_to_hocs),
                                            api.updateTkbContentMmh(
                                                e.data.id,
                                                tkbHandler.ma_hoc_phans,
                                            ),
                                        ]);

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
                addMember: () => {
                    if (tkbHandler.tkbData) {
                        if (tkbHandler.tkbData.isClient) {
                            notifyMaster.error(
                                'không thể chia sẻ tkb client, sạo bản sao phía server rồi thử lại nha.',
                            );
                            return;
                        }
                        setPopup(
                            <Share
                                tkbid={tkbid || ''}
                                open={true}
                                modal
                                onClose={() => setPopup('')}
                            ></Share>,
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
                googleCalendar: () => {
                    let url = '';

                    if (tkbHandler.tkbData?.isClient) {
                        url =
                            apiConfig.baseUrl +
                            apiConfig.googleOauthCalendar() +
                            '?tkbData=' +
                            encodeURI(JSON.stringify(tkbHandler.id_to_hocs)) +
                            '&access_token=' +
                            encodeURI(globalState.client.token || '');
                    } else {
                        url =
                            apiConfig.baseUrl +
                            apiConfig.googleOauthCalendar() +
                            '?tkbId=' +
                            encodeURI(tkbid || '') +
                            '&access_token=' +
                            encodeURI(globalState.client.token || '');
                    }

                    windowPopup.open({
                        url: url,
                        title: 'tkb',
                        h: 500,
                        w: 400,
                    });
                },
            };
            return commandObj[key];
        },
        [
            globalState.client.localApi,
            globalState.client.serverApi,
            globalState.client.token,
            nav,
            tkbHandler,
            tkbid,
            windowPopup,
        ],
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

    const resize = (ev: MouseEvent) => {
        console.log(ev.x);
        setSideBarWidth(ev.x - 2);
    };

    const mouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setResize(true);
        document.addEventListener('mousemove', resize);
        document.addEventListener(
            'mouseup',
            () => {
                setResize(false);
                document.removeEventListener('mousemove', resize);
            },
            false,
        );
        console.log(event.clientX);
    };

    useHotkeys(
        'ctrl+z',
        () => {
            const command = commands('undo');
            if (command) command();
        },
        [commands],
    );

    useHotkeys(
        'ctrl+y',
        () => {
            const command = commands('redo');
            if (command) command();
        },
        [commands],
    );

    useHotkeys(
        'ctrl+a',
        () => {
            selection.addAll(tkbHandler.id_to_hocs);
        },
        [selection, tkbHandler.id_to_hocs],
    );

    useHotkeys(
        'Escape',
        () => {
            console.log('okkkk');
            if (selection) selection.clear();
        },
        [selection],
    );

    useHotkeys(
        'Delete',
        () => {
            if (!selection.selection) return;
            [...selection.selection].forEach((e) => {
                tkbHandler.onRemoveNhomHocHandler(e);
            });
            selection.clear();
        },
        [selection, tkbHandler],
    );

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
                    // isReadOnly={tkbTemp.rule >= 3}
                    isReadOnly={false}
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
        tkbHandler.setIconSaveing('notsave');
        tkbHandler.id_to_hocs.forEach((e) => {
            const nhom = dsNhomHoc.ds_nhom_to.find((j) => j.id_to_hoc === e);
            if (nhom) sCT += nhom.so_tc;
        });

        if (soTC >= 0) {
            if (idAutoSaveTimeOut.current) clearTimeout(idAutoSaveTimeOut.current);
            idAutoSaveTimeOut.current = setTimeout(() => {
                tkbHandler.doUpdate();
            }, 5000);
        }
        setSoTC(sCT);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        tkbHandler.doUpdate,
        tkbHandler.dsNhomHoc,
        tkbHandler.tkbData,
        tkbHandler.id_to_hocs,
        tkbHandler.ma_hoc_phans,
    ]);

    const sideBars: { [Key: string]: ReactNode } = {
        tutu: (
            <ReplaceView
                id_to_hocs={tkbHandler.id_to_hocs}
                ma_hoc_phans={tkbHandler.ma_hoc_phans}
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
                    <div
                        className={cx('side-bar')}
                        style={
                            isTabletOrMobile
                                ? { height: miniSide ? 0 : '' }
                                : {
                                      width: miniSide ? 0 : sideBarWidth + 'px',
                                  }
                        }
                    >
                        {sideBars[sideBar] || (
                            <SelestionView
                                id_to_hocs={tkbHandler.id_to_hocs}
                                ma_hoc_phans={tkbHandler.ma_hoc_phans}
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
                    <div
                        id="resizer"
                        className={cx('resizer', {
                            md: isResize,
                        })}
                        onMouseDown={mouseDown}
                    ></div>
                    <div
                        className={cx('calendar-wrapper')}
                        style={{
                            width: `calc(100% - 5px - ${miniSide ? 0 : sideBarWidth}px)`,
                        }}
                    >
                        <Calendar
                            onMiniSide={miniSideBar}
                            conflict={tkbHandler.conflict}
                            data={tkbHandler.dsNhomHoc?.ds_nhom_to}
                            idToHocs={tkbHandler.id_to_hocs}
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
