import React, { useEffect, useRef, useState } from 'react';
import { cx } from './Tkb';

interface TOOL {
    title: string;
    icon?: string;
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
                    title: 'Tạo Mới',
                    onclick: createdCommand('new'),
                    pos: 'Left',
                },
                {
                    title: 'Lưu thành file',
                    onclick: createdCommand('saveAsFile'),
                    pos: 'Left',
                },
                {
                    title: 'Mở TKB Có Sẵn',
                    onclick: createdCommand('open'),
                    pos: 'Left',
                },
                {
                    title: 'Property',
                    onclick: createdCommand('property'),
                    pos: 'Left',
                },
                {
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
                    title: 'Undo',
                    onclick: createdCommand('undo'),
                    pos: 'Left',
                },
                {
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
