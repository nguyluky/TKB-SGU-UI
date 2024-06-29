import { faGripLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { CSSProperties, MouseEvent, useState } from 'react';

import { DsNhomTo } from '../../Tkb/Tkb';
import style from './Calendar.module.scss';

const cx = classNames.bind(style);

interface CustomEvent extends MouseEvent {
    thu?: number;
    tiet?: number;
}

interface Props {
    data?: DsNhomTo[];
    idToHocs?: string[];
}

function Calendar({ data, idToHocs }: Props) {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

    const [direction, setDirectiom] = useState(false);

    const [isMouseDown, setMouseDown] = useState<boolean>(false);

    const handleMouseDown = (event: CustomEvent) => {
        console.log(event.thu, event.tiet);
        setMouseDown(true);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isMouseDown) return;
        if (!event.buttons) setMouseDown(false);
        // console.log(event.clientX, event.clientY, event.buttons);
    };

    return (
        <div
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

            <div className={cx('tiets')}>
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
                    {idToHocs?.map((e) => {
                        // console.log(e);
                        var tiet = data?.find((j) => j.id_to_hoc === e);

                        var eles = tiet?.tkb.map((jj) => {
                            // TODO: left top không dúng vị trí khi thay đổi chế độ
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
                                width: `calc((100% - var(--left-m)) / var(--columns) * (2 * var(--x-s) + 1) - 5px)`,
                                background: `hsl(${Math.abs(+e)}, 60%, 50%)`,
                            };

                            return (
                                <div
                                    className={cx('item')}
                                    style={itemStyle}
                                    key={e + jj.thu + jj.tbd}
                                >
                                    <p className={cx('title')}>{tiet?.ten_mon}</p>
                                    <p className={cx('info')}>GV: {jj.gv}</p>
                                    <p className={cx('info')}>Phòng: {jj.phong}</p>
                                </div>
                            );
                        });
                        return eles;
                    })}
                </div>
            </div>
        </div>
    );
}

export default Calendar;
