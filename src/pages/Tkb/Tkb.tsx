import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import { headerContent } from '../../components/Layout/DefaultLayout';

// import { toPng } from 'html-to-image';

import notifyMaster from '../../components/NotifyPopup/NotificationManager';
import useCommand, { commandsInterface } from '../../Hooks/useCommand';
import useSelection from '../../Hooks/useSelection';
import { UseShortCut as useShortCut } from '../../Hooks/UseShortCut';
import useTkbHandler from '../../Hooks/useTkbHandler';
import Calendar from '../components/Calendar';
import Loader from '../components/Loader';
import Error from '../Error';
import { HeaderTool } from './HeaderTool';
import MemberView from './MemberVIew';
import { ReName } from './ReName';
import { ReplaceView, SelestionView } from './SelestionView';
import style from './Tkb.module.scss';

export const cx = classNames.bind(style);

export type useTkbHandlerTypes = ReturnType<typeof useTkbHandler>;

export const tkbContext = createContext<useTkbHandlerTypes>(null!);

export default function Tkb() {
    // context
    const setHeaderPar = useContext(headerContent);

    // useParams
    const { tkbid } = useParams();
    const [searchParams] = useSearchParams();

    // tkb data
    const [replayIdToHoc, setReplayIdToHoc] = useState<string[]>([]);
    const [soTC, setSoTC] = useState<number>(-1);

    // state
    const [sideBar, setSideBar] = useState<string>('');
    const selection = useSelection();
    const [sideBarWidth, setSideBarWidth] = useState<number>(290);
    const [miniSide, setMintSide] = useState(false);
    const [isResize, setResize] = useState(false);

    const idAutoSaveTimeOut = useRef<NodeJS.Timeout>();

    const tkbHandler = useTkbHandler(tkbid || '', !!searchParams.get('isclient'));
    const { commands, popup } = useCommand(tkbHandler);
    // const popupSave = useTkbBeforeunload(tkbHandler.iconSaveing !== 'saved');
    useShortCut(commands, tkbHandler, selection);

    const isTabletOrMobile = useMediaQuery('(max-width: 800px)');

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
        [commands]
    );

    useEffect(() => {
        const tkbTemp = tkbHandler.tkbData;
        if (!tkbTemp) return;
        setHeaderPar((e) => {
            e.left = <HeaderTool onCommandEvent={onCommandHandel} />;
            e.right = <MemberView userIds={tkbHandler.users} />;
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
    }, [setHeaderPar, tkbHandler.tkbData?.name, tkbHandler.iconSaveing, tkbHandler.users]);

    const miniSideBar = () => {
        setMintSide((e) => !e);
    };

    const timNhomHocTuongTuHandel = (idToHocs: string[]) => {
        console.log(idToHocs);
        setSideBar('tutu');
        setReplayIdToHoc(idToHocs);
    };

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
            false
        );
        console.log(event.clientX);
    };

    // TODO: chuyển vào trong useTkbHandler
    // sửa lỗi mỗi khi vào là nó tính là thay đổi
    // chỉ cập nhật tường phần tử thay đổi
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
    }, [tkbHandler.doUpdate, tkbHandler.dsNhomHoc, tkbHandler.tkbData, tkbHandler.id_to_hocs, tkbHandler.ma_hoc_phans]);

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
            <tkbContext.Provider value={tkbHandler}>
                {tkbHandler.errMsg ? (
                    <Error msg={tkbHandler.errMsg} code={401} />
                ) : (
                    <motion.div className={cx('wrapper')}>
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
                    </motion.div>
                )}
            </tkbContext.Provider>
        </Loader>
    );
}
