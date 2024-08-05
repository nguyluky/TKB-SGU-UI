import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
    faCalendarDays,
    faClone,
    faDownload,
    faFolderOpen,
    faReply,
    faRightFromBracket,
    faShare,
    faShareFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { cx } from './Tkb';

interface TOOL {
    title: string;
    icon?: IconProp;
    onclick?: () => void;
    pos: 'Left' | 'bottom';
    children?: TOOL[];
}

function Tool({
    tool,
    onMouseEnter,
    onClick,
    onClickOutSide,
    titleShow,
}: {
    tool: TOOL;
    onMouseEnter: React.MouseEventHandler<HTMLSpanElement>;
    onClick: React.MouseEventHandler<HTMLSpanElement>;
    onClickOutSide?: () => void;
    titleShow: string;
}) {
    const toolref = useRef<HTMLDivElement>(null);
    const [tabShow, setTabShow] = useState<string>('');

    const mouseEnterHandler = (event: React.MouseEvent<HTMLSpanElement>) => {
        if (!tabShow) return;

        var spanEle = event.target as HTMLSpanElement;
        setTabShow(spanEle.textContent || '');
    };

    const mouseClickHandler = (event: React.MouseEvent<HTMLSpanElement>) => {
        if (tabShow) {
            setTabShow('');
            return;
        }

        var spanEle = event.target as HTMLSpanElement;
        setTabShow(spanEle.textContent || '');
    };

    const onClickOutSideHandler = () => {
        setTabShow('');
    };

    useEffect(() => {
        setTabShow('');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [titleShow === tool.title]);

    useEffect(() => {
        function onClickOutSide1(event: MouseEvent) {
            if (tool.title !== titleShow) return;

            if (toolref.current && !toolref.current.contains(event.target as Node)) {
                if (onClickOutSide) onClickOutSide();
            }
        }

        document.body.addEventListener('click', onClickOutSide1);

        return () => {
            document.body.removeEventListener('click', onClickOutSide1);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toolref, titleShow === tool.title]);

    return (
        <div className={cx('tool-item')} ref={toolref}>
            <span
                className={cx('title')}
                onMouseEnter={tool.children ? onMouseEnter : undefined}
                onClick={tool.children ? onClick : tool.onclick}
            >
                <div className={cx('icon')}>
                    {tool.icon ? <FontAwesomeIcon icon={tool.icon} size="sm" /> : ''}
                </div>

                {tool.title}
            </span>

            {tool.title === titleShow ? (
                tool.children ? (
                    <div className={cx('drop-down-item', tool.pos)}>
                        {tool.children?.map((e, i) => {
                            if (e.onclick) {
                                var c = e.onclick;
                                e.onclick = (...arg) => {
                                    if (onClickOutSide) onClickOutSide();
                                    c(...arg);
                                };
                            }

                            return (
                                <Tool
                                    key={e.title + i}
                                    tool={e}
                                    titleShow={tabShow}
                                    onMouseEnter={mouseEnterHandler}
                                    onClick={mouseClickHandler}
                                    onClickOutSide={onClickOutSideHandler}
                                />
                            );
                        })}
                    </div>
                ) : (
                    ''
                )
            ) : (
                ''
            )}
        </div>
    );
}

interface HeaderToolProps {
    onCommandEvent: (command: string) => void;
}

export function HeaderTool({ onCommandEvent }: HeaderToolProps) {
    const createdCommand = (command: string) => {
        return () => {
            onCommandEvent(command);
        };
    };

    const tools: TOOL[] = [
        {
            title: 'Tùy Chọn',
            icon: undefined,
            pos: 'bottom',
            children: [
                {
                    icon: faCalendarDays,
                    title: 'Tạo Mới',
                    onclick: createdCommand('new'),
                    pos: 'Left',
                },
                {
                    icon: faClone,
                    title: 'Tạo Bạn Sao',
                    onclick: createdCommand('clone'),
                    pos: 'Left',
                },
                {
                    icon: faFolderOpen,
                    title: 'Open',
                    onclick: createdCommand('open'),
                    pos: 'Left',
                },
                {
                    icon: faDownload,
                    title: 'Tải xuống',
                    onclick: createdCommand('saveAsFile'),
                    pos: 'Left',
                },
                {
                    title: 'Properties',
                    onclick: createdCommand('property'),
                    pos: 'Left',
                },
                {
                    icon: faRightFromBracket,
                    title: 'Exit',
                    onclick: createdCommand('exit'),
                    pos: 'Left',
                },
            ],
        },
        {
            title: 'Edit',
            icon: undefined,
            pos: 'bottom',
            children: [
                {
                    icon: faReply,
                    title: 'Undo',
                    onclick: createdCommand('undo'),
                    pos: 'Left',
                },
                {
                    icon: faShare,
                    title: 'Redo',
                    onclick: createdCommand('redo'),
                    pos: 'Left',
                },
                {
                    title: 'Cut',
                    onclick: createdCommand('cut'),
                    pos: 'Left',
                },
                {
                    title: 'Past',
                    onclick: createdCommand('past'),
                    pos: 'Left',
                },
            ],
        },
        {
            title: 'Share',
            icon: undefined,
            pos: 'bottom',
            children: [
                {
                    icon: faShareFromSquare,
                    title: 'Tạo lời mời',
                    onclick: createdCommand('addMember'),
                    pos: 'Left',
                },
                {
                    icon: undefined,
                    title: 'quản lý',
                    onclick: createdCommand('quản lý'),
                    pos: 'Left',
                },
            ],
        },
    ];

    const [tabShow, setTabShow] = useState<string>('');
    const mouseEnterHandler = (event: React.MouseEvent<HTMLSpanElement>) => {
        if (!tabShow) return;

        var spanEle = event.target as HTMLSpanElement;

        setTabShow(spanEle.textContent || '');
    };

    const mouseClickHandler = (event: React.MouseEvent<HTMLSpanElement>) => {
        if (tabShow) {
            setTabShow('');
            return;
        }

        var spanEle = event.target as HTMLSpanElement;
        setTabShow(spanEle.textContent || '');
    };

    const onClickOutSideHandler = () => {
        setTabShow('');
    };

    return (
        <div className={cx('tools')}>
            {tools.map((e, i) => (
                <Tool
                    key={e.title + i}
                    tool={e}
                    titleShow={tabShow}
                    onMouseEnter={mouseEnterHandler}
                    onClick={mouseClickHandler}
                    onClickOutSide={onClickOutSideHandler}
                />
            ))}
        </div>
    );
}
