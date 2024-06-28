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
                        {tool.children?.map((e, i) => (
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
                ) : (
                    ''
                )
            ) : (
                ''
            )}
        </div>
    );
}

export function HeaderTool({ saveAsFile }: { saveAsFile: () => void }) {
    const tools: TOOL[] = [
        {
            title: 'file',
            icon: undefined,
            pos: 'bottom',
            children: [
                {
                    title: 'New',
                    onclick: () => {
                        console.log('hello');
                    },
                    pos: 'Left',
                },
                {
                    title: 'Save As',
                    onclick: saveAsFile,
                    pos: 'Left',
                },
                {
                    title: 'Open',
                    onclick: () => {
                        console.log('hello');
                    },
                    pos: 'Left',
                },
                {
                    title: 'Property',
                    onclick: () => {
                        console.log('hello');
                    },
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
