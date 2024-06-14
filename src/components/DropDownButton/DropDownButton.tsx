import { ReactElement, useState, useRef, MouseEventHandler, MouseEvent } from 'react';
import classNames from 'classnames';
import classNamesBind from 'classnames/bind';
import { useOnClickOutside } from 'usehooks-ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import style from './DropDownButton.module.scss';

const cx = classNamesBind.bind(style);

interface ActivityItemProps {
    className?: string;
    icon: IconProp;
    children?: ReactElement;
    onClick?: MouseEventHandler;
}

function DropDownButton({ className, icon, children, onClick }: ActivityItemProps) {
    const dorpDownRef = useRef(null);

    const [isDropDownShow, setDropDownShow] = useState(false);

    const handleClickOutsSide = () => {
        setDropDownShow(false);
    };

    const handleOnClickIcon = (event: MouseEvent) => {
        if (onClick) onClick(event);
        else setDropDownShow((e) => !e);
    };

    useOnClickOutside(dorpDownRef, handleClickOutsSide);

    return (
        <div className={classNames(cx('button-wrapper'), className)} ref={dorpDownRef}>
            <div className={cx('icon-wrapper')} onClick={handleOnClickIcon}>
                <FontAwesomeIcon icon={icon} />
            </div>
            <div className={cx('activity-drop-down')}>{isDropDownShow ? <div className={cx('drop-down-wrapper')}>{children}</div> : ''}</div>
        </div>
    );
}

export default DropDownButton;
