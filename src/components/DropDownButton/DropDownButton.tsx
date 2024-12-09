import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import classNamesBind from 'classnames/bind';
import { MouseEvent, MouseEventHandler, ReactNode, useEffect, useRef, useState } from 'react';

import style from './DropDownButton.module.scss';

const cx = classNamesBind.bind(style);

interface ActivityItemProps {
    className?: string;
    icon: IconProp;
    url?: string;
    children?: ReactNode | ReactNode[];
    onClick?: MouseEventHandler;
    keepOpen?: boolean;
}

function DropDownButton({ className, icon, children, onClick, url, keepOpen }: ActivityItemProps) {
    const dorpDownRef = useRef<HTMLDivElement>(null);

    const [isDropDownShow, setDropDownShow] = useState(false);

    const handleOnClickIcon = (event: MouseEvent) => {
        if (onClick) onClick(event);
        else setDropDownShow((e) => !e);
    };

    // FIX: why this not work
    // useOnClickOutside(dorpDownRef, handleClickOutsSide);

    useEffect(() => {
        if (!children) return;
        const handleClickOutsSide = (event: globalThis.MouseEvent) => {
            if (!event.target) return;
            if (!dorpDownRef.current?.contains(event.target as Node)) setDropDownShow(false);
        };
        document.body.addEventListener('click', handleClickOutsSide);

        return () => document.body.removeEventListener('click', handleClickOutsSide);
    }, [setDropDownShow, dorpDownRef, children]);

    return (
        <div className={classNames(cx('button-wrapper'), className)} ref={dorpDownRef}>
            <div className={cx('icon-wrapper')} onClick={handleOnClickIcon}>
                {!url ? <FontAwesomeIcon icon={icon} /> : <img src={url} alt="avt" referrerPolicy="no-referrer" />}
            </div>
            <div
                className={cx('activity-drop-down', {
                    show: isDropDownShow && children,
                })}
                onClick={() => {
                    if (!keepOpen) setDropDownShow(false);
                }}
            >
                {isDropDownShow && children ? <div className={cx('drop-down-wrapper')}>{children}</div> : ''}
            </div>
        </div>
    );
}

export default DropDownButton;
