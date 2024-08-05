import { faGripLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import {
    createRef,
    CSSProperties,
    MouseEvent,
    RefObject,
    useEffect,
    useRef,
    useState,
} from 'react';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { DsNhomTo } from '../../../Service';
import { hashCode } from '../../../utils';
import style from './Calendar.module.scss';

const cx = classNames.bind(style);

interface CustomEvent extends MouseEvent {
    thu?: number;
    tiet?: number;
}

interface Props {
    data?: DsNhomTo[];
    idToHocs?: string[];
    conflict: string[];
    onDeleteNhomHoc: (idToHoc: string) => void;
    onTimMonHocTuTu: (idToHocs: string[]) => void;
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

function Calendar({ data, idToHocs, onDeleteNhomHoc, onTimMonHocTuTu, conflict }: Props) {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    const bodyRef = useRef<HTMLDivElement>(null!);
    const contextRef = useRef<HTMLDivElement>(null!);
    const lastSelecion = useRef<string>('');
    const calendarRef = useRef<HTMLDivElement>(null);

    const [direction, setDirectiom] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [isMouseDown, setMouseDown] = useState<boolean>(false);
    const [tietDisplay, setTietDisplay] = useState<TietDisplay[]>([]);

    const [contextX, setContextX] = useState<number>(0);
    const [contextY, setContextY] = useState<number>(0);
    const [contextIsOpen, setContextIsOpen] = useState<boolean>(false);

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
        // event.stopPropagation();
        // onDeleteMHP
        setContextIsOpen(false);
        [...selected].forEach((e) => {
            onDeleteNhomHoc(e);
        });
        setSelected([]);
    };

    useEffect(() => {
        const onClickHanled = (event: globalThis.MouseEvent) => {
            var isClickOutSide = true;

            tietDisplay.forEach((e) => {
                if (e.nodeRef.current?.contains(event.target as HTMLElement))
                    isClickOutSide = false;
            });

            if (contextRef.current && contextRef.current.contains(event.target as HTMLElement))
                isClickOutSide = false;

            if (isClickOutSide) {
                console.log('ok');
                setSelected([]);
                setMouseDown(true);
            }

            if (!(event.target as HTMLDivElement).contains(contextRef.current)) {
                if (lastSelecion.current)
                    setSelected((ses) => {
                        if (ses.includes(lastSelecion.current))
                            ses.splice(ses.indexOf(lastSelecion.current), 1);
                        lastSelecion.current = '';
                        return [...ses];
                    });
                setContextIsOpen(false);
            }
        };

        const onKeyDownHandled = (event: KeyboardEvent) => {
            if (event.keyCode === 65 && event.ctrlKey) {
                setSelected(idToHocs || []);
            }
        };

        document.addEventListener('keydown', onKeyDownHandled);
        document.getElementById('default-content')?.addEventListener('click', onClickHanled);

        return () => {
            document.getElementById('default-content')?.removeEventListener('click', onClickHanled);
            document.removeEventListener('keydown', onKeyDownHandled);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tietDisplay]);

    useEffect(() => {
        var temp: TietDisplay[] = [];
        idToHocs?.forEach((e) => {
            var tiet = data?.find((j) => j.id_to_hoc === e);

            tiet?.tkb.forEach((jj, i) => {
                var itemStyle: CSSProperties = {
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

                var nodeRef =
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
                                        onMouseDown={(event) => {
                                            const customEvent: CustomEvent = event as CustomEvent;
                                            customEvent.thu = t;
                                            customEvent.tiet = i;
                                            handleMouseDown(customEvent);
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                    );
                })}
                <div className={cx('display-tiet')}>
                    <TransitionGroup>
                        {tietDisplay.map((tr) => (
                            <CSSTransition key={tr.key} nodeRef={tr.nodeRef} timeout={100}>
                                {(state) => {
                                    return (
                                        <div
                                            ref={tr.nodeRef}
                                            key={tr.key}
                                            onContextMenu={(event) => {
                                                event.preventDefault();
                                                var { x, y } =
                                                    bodyRef.current.getBoundingClientRect();
                                                console.log();
                                                console.log(event.clientX - x, event.clientY - y);

                                                setSelected((ses) => {
                                                    if (!ses.length) {
                                                        lastSelecion.current = tr.id_to_hoc;
                                                        return [tr.id_to_hoc, ...ses];
                                                    }
                                                    return [...ses];
                                                });
                                                setContextX(event.clientX - x);
                                                setContextY(event.clientY - y);
                                                setContextIsOpen(true);
                                            }}
                                            onClick={(event) => {
                                                setSelected((sel) => {
                                                    if (event.ctrlKey) {
                                                        if (sel.includes(tr.id_to_hoc))
                                                            sel.splice(
                                                                sel.indexOf(tr.id_to_hoc),
                                                                1,
                                                            );
                                                        else sel.push(tr.id_to_hoc);
                                                        return [...sel];
                                                    }
                                                    if (
                                                        sel.length === 1 &&
                                                        sel.includes(tr.id_to_hoc)
                                                    ) {
                                                        return [];
                                                    }
                                                    return [tr.id_to_hoc];
                                                });
                                            }}
                                            className={cx('item', state, {
                                                'tiet-selected': selected.includes(tr.id_to_hoc),
                                                conflict: conflict.includes(tr.id_to_hoc),
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
                        ))}
                    </TransitionGroup>

                    <div
                        ref={contextRef}
                        className={cx('context-popup', 'item', {
                            show: contextIsOpen,
                        })}
                        style={{
                            top: contextY + 'px',
                            left: contextX + 'px',
                        }}
                    >
                        <p
                            onClick={(e) => {
                                setContextIsOpen(false);
                                onTimMonHocTuTu(selected);
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
