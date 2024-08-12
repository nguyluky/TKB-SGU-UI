import { faGripLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import {
    createRef,
    CSSProperties,
    memo,
    MouseEvent,
    RefObject,
    useEffect,
    useRef,
    useState,
} from 'react';
import useSelection from '../../../Hooks/useSelection';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { NhomHoc } from '../../../Service';
import { hashCode } from '../../../utils';
import style from './Calendar.module.scss';

const cx = classNames.bind(style);

interface CustomEvent extends MouseEvent {
    thu?: number;
    tiet?: number;
}

interface TietDisplay {
    gv: string;
    phong: string;
    ten_mon: string;
    id_mon: string;
    style: CSSProperties;
    id_to_hoc: string;
    nhom: string;
    key: string;
    nodeRef: RefObject<HTMLDivElement>;
}

interface CalendarCellProps {
    tietDisplay: TietDisplay[];
    selectedEd: string[];
    conflictEd: string[];
    onContextMenu: (event: MouseEvent<HTMLDivElement>, idToHoc: string) => void;
    onClickHanled: (event: MouseEvent<HTMLDivElement>, idToHoc: string) => void;
}

function CalendarCell({
    tietDisplay,
    selectedEd,
    conflictEd,
    onContextMenu,
    onClickHanled,
}: CalendarCellProps) {
    return (
        <TransitionGroup>
            {tietDisplay.map((tr) => {
                return (
                    <CSSTransition key={tr.key} nodeRef={tr.nodeRef} timeout={100}>
                        {(state) => {
                            return (
                                <div
                                    ref={tr.nodeRef}
                                    key={tr.key}
                                    onContextMenu={(event) => onContextMenu(event, tr.id_to_hoc)}
                                    onClick={(event) => onClickHanled(event, tr.id_to_hoc)}
                                    className={cx('item', state, {
                                        'tiet-selected': selectedEd.includes(tr.id_to_hoc),
                                        conflict: conflictEd.includes(tr.id_to_hoc),
                                    })}
                                    style={tr.style}
                                >
                                    <p
                                        className={cx('title')}
                                        content={`${tr.ten_mon} (${tr.id_mon})`}
                                    >
                                        {tr.ten_mon} ({tr.id_mon})
                                    </p>
                                    <p className={cx('info')}>GV: {tr.gv}</p>
                                    <p className={cx('info')}>Nhóm: {tr.nhom}</p>
                                    <p className={cx('info')}>Phòng: {tr.phong}</p>
                                </div>
                            );
                        }}
                    </CSSTransition>
                );
            })}
        </TransitionGroup>
    );
}

interface Props {
    data?: NhomHoc[];
    idToHocs?: string[];
    conflict: string[];
    selection: ReturnType<typeof useSelection>;
    onDeleteNhomHoc: (idToHoc: string) => void;
    onTimMonHocTuTu: (idToHocs: string[]) => void;
}

const RenderTiet = memo(() => {
    return (
        <>
            <div className={cx('calendar-day', 'tiet-display')}>
                {Array.from(Array(14).keys()).map((e, i) => {
                    return (
                        <div className={cx('tiet')} key={i}>
                            <p>{i + 1}</p>
                        </div>
                    );
                })}
            </div>
            {Array.from(Array(7).keys()).map((t) => {
                return (
                    <div className={cx('calendar-day')} key={t}>
                        {Array.from(Array(14).keys()).map((i) => {
                            return (
                                <div
                                    className={cx('tiet')}
                                    key={i}
                                    // onMouseDown={(event) => {
                                    //     const customEvent: CustomEvent = event as CustomEvent;
                                    //     customEvent.thu = t;
                                    //     customEvent.tiet = i;
                                    //     handleMouseDown(customEvent);
                                    // }}
                                ></div>
                            );
                        })}
                    </div>
                );
            })}
        </>
    );
});

function Calendar({
    data,
    idToHocs,
    onDeleteNhomHoc,
    onTimMonHocTuTu,
    conflict,
    selection,
}: Props) {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    const bodyRef = useRef<HTMLDivElement>(null!);
    const contextRef = useRef<HTMLDivElement>(null!);
    // const lastSelecion = useRef<string>('');
    const calendarRef = useRef<HTMLDivElement>(null);

    const [direction, setDirectiom] = useState(false);
    const [isMouseDown, setMouseDown] = useState<boolean>(false);
    const [tietDisplay, setTietDisplay] = useState<TietDisplay[]>([]);
    const [contentPos, setContentPos] = useState<[x: number, y: number, isOpen: number]>([0, 0, 0]);

    const handleMouseDown = (event: CustomEvent) => {
        console.log(event.thu, event.tiet);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isMouseDown) return;
        if (!event.buttons) setMouseDown(false);
        // console.log(event.clientX, event.clientY, event.buttons);
    };

    const onDeleteHandel = (event: MouseEvent<HTMLDivElement>) => {
        console.log('delete on click');
        setContentPos((e) => {
            if (!e) return e;
            e[2] = 0;
            return [...e];
        });
        // setContextIsOpen(false);
        [...selection.selection].forEach((e) => {
            onDeleteNhomHoc(e);
            // setSelected([]);
        });
    };

    const onConntextMenu = (event: MouseEvent<HTMLDivElement>, idToHoc: string) => {
        event.preventDefault();
        const { x, y } = bodyRef.current.getBoundingClientRect();
        console.log();
        console.log(event.clientX - x, event.clientY - y);

        if (selection.selection.length === 0) {
            selection.select(idToHoc);
        }

        setContentPos([event.clientX - x, event.clientY - y, 1]);
    };

    const onClickHanled = (event: MouseEvent<HTMLDivElement>, idToHoc: string) => {
        if (event.ctrlKey) {
            selection.toggle(idToHoc);
            return;
        }
        selection.select(idToHoc);
    };

    useEffect(() => {
        const temp: TietDisplay[] = [];
        idToHocs?.forEach((e) => {
            const tiet = data?.find((j) => j.id_to_hoc === e);

            tiet?.tkb.forEach((jj, i) => {
                const itemStyle: CSSProperties = {
                    left: `calc(((100% - var(--left-m)) / var(--columns)) * (${
                        +jj.thu - 2
                    } * var(--y-s) + ${jj.tbd - 1} * var(--x-s))  + var(--left-m))`,
                    top: `calc(((100% - var(--top-m)) / var(--rows)) * (${
                        +jj.thu - 2
                    } * var(--x-s) + ${jj.tbd - 1} * var(--y-s)) + var(--top-m))`,
                    height: `calc((100% - var(--top-m)) / var(--rows) * (${
                        jj.tkt - jj.tbd
                    } * var(--y-s) + 1) - 5px)`,
                    width: `calc((100% - var(--left-m)) / var(--columns) * (var(--x-s) + 1) - 5px)`,
                    background: `hsl(${Math.abs(
                        hashCode(tiet?.ma_mon || '0'),
                    )} var(--tkb-nhom-view-HSL) )`,
                    scrollbarColor: `hsl(${Math.abs(
                        hashCode(tiet?.ma_mon || '0'),
                    )} 20 50 )  transparent`,
                    opacity: tiet?.ma_mon === '862408' || tiet?.ma_mon === '862409' ? 0.5 : 1,
                    zIndex: tiet?.ma_mon === '862408' || tiet?.ma_mon === '862409' ? 0 : 1,
                };

                const nodeRef =
                    tietDisplay.find((e) => e.key === (tiet?.ma_mon || '') + i)?.nodeRef ||
                    createRef();

                temp.push({
                    gv: jj.gv || '',
                    phong: jj.phong,
                    ten_mon: tiet?.ten_mon || '',
                    id_mon: tiet?.ma_mon || '',
                    nhom: tiet?.nhom || '',
                    style: itemStyle,
                    id_to_hoc: tiet?.id_to_hoc || '',
                    key: (tiet?.ma_mon || '') + i,
                    nodeRef: nodeRef,
                });
            });
        });

        setTietDisplay(temp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(idToHocs)]);

    useEffect(() => {
        const onClickHanled = (event: globalThis.MouseEvent) => {
            if (selection.selection.length > 0 || contentPos[2]) {
                let isClickOutSide = true;

                tietDisplay.forEach((e) => {
                    if (e.nodeRef.current?.contains(event.target as HTMLElement))
                        isClickOutSide = false;
                });

                if (contextRef.current && contextRef.current.contains(event.target as HTMLElement))
                    isClickOutSide = false;

                if (isClickOutSide) {
                    console.log('ok');
                    selection.clear();
                    setMouseDown(true);
                    setContentPos([0, 0, 0]);
                }
            }
        };

        document.getElementById('default-content')?.addEventListener('click', onClickHanled);

        return () => {
            document.getElementById('default-content')?.removeEventListener('click', onClickHanled);
        };
    }, [contentPos, idToHocs, selection, tietDisplay]);

    return (
        <div
            ref={calendarRef}
            className={cx('calendar', { 'layout-row': direction, 'layout-column': !direction })}
            onMouseMove={handleMouseMove}
        >
            <div className={cx('thu')}>
                <div className={cx('day-name')} onClick={() => setDirectiom((e) => !e)}>
                    <FontAwesomeIcon icon={faGripLines} />
                </div>
                {Array.from(Array(7).keys()).map((t, i) => {
                    return (
                        <div className={cx('day-name')} key={i}>
                            <p>{days[t]}</p>
                        </div>
                    );
                })}
            </div>

            <div className={cx('tiets')} ref={bodyRef}>
                <RenderTiet />
                <div className={cx('display-tiet')}>
                    <CalendarCell
                        tietDisplay={tietDisplay}
                        selectedEd={selection.selection}
                        conflictEd={conflict}
                        onClickHanled={onClickHanled}
                        onContextMenu={onConntextMenu}
                    />

                    <div
                        ref={contextRef}
                        className={cx('context-popup', 'item', {
                            show: contentPos[2],
                        })}
                        style={{
                            top: contentPos[1] + 'px',
                            left: contentPos[0] + 'px',
                        }}
                    >
                        <p
                            onClick={(e) => {
                                setContentPos((e) => {
                                    if (!e) return e;
                                    e[2] = 0;
                                    return [...e];
                                });
                                onTimMonHocTuTu(selection.selection);
                            }}
                        >
                            Replace
                        </p>
                        <p onClick={onDeleteHandel}>Delete</p>
                        <p onClick={(e) => alert('chưa làm')}>Make to templa</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calendar;
