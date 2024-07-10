import classNames from 'classnames/bind';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
    faBug,
    faCheck,
    faInfo,
    faTriangleExclamation,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NotifyMaster } from '.';
import { NotifyItem } from './NotificationManager';
import style from './NotifyPopup.module.scss';

const cx = classNames.bind(style);

interface Icons {
    [Key: string]: IconProp;
}

function NotifyElement({ data }: { data: NotifyItem }) {
    const type: string = data.notifyType;
    const [countDown, setCountDown] = useState<number>(data.timeOut || 0);
    const timerId = useRef<NodeJS.Timer>();

    const icons: Icons = {
        error: faBug,
        info: faInfo,
        success: faCheck,
        warning: faTriangleExclamation,
    };

    useLayoutEffect(() => {
        if ((data.timeOut || 5000) > 0 && countDown < 0) {
            // console.log(data.id);
            closeHandel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countDown]);

    useEffect(() => {
        if ((data.timeOut || 5000) < 0) return;

        timerId.current = setInterval(() => {
            setCountDown((e) => e - 10);
        }, 10);

        return () => {
            clearInterval(timerId.current);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const closeHandel = () => {
        NotifyMaster.remove(data.id);
    };

    return (
        <div className={cx('popup-element', type)}>
            <div className={cx('header')}>
                <FontAwesomeIcon icon={icons[type]} size="2xl" className={cx('icon')} />
                <p className={cx('title')}>{data.title}</p>
                <FontAwesomeIcon icon={faXmark} onClick={closeHandel} className={cx('close')} />
            </div>
            <div className={cx('body')}>{data.message}</div>
            <div
                className={cx('loading')}
                style={{
                    width: data.timeOut ? (countDown / data.timeOut) * 100 + '%' : '100%',
                }}
            ></div>
        </div>
    );
}

export default NotifyElement;
