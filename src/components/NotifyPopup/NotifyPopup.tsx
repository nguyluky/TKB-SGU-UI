import { ReactElement, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import NotifyElement from './NotifyElement';

import NotifyMaster, { NotifyItem, NotifyType } from './NotificationManager';
import style from './NotifyPopup.module.scss';

const cx = classNames.bind(style);

function NotifyPopup({ children }: { children: ReactElement | ReactElement[] }) {
    var [listNotify, setListNotify] = useState<NotifyItem[]>([]);

    const changeHandle = (list: NotifyItem[]) => {
        setListNotify([...list]);
    };

    useEffect(() => {
        NotifyMaster.addListener(NotifyType.CHANGE, changeHandle);

        return () => {
            NotifyMaster.removeListener(NotifyType.CHANGE, changeHandle);
        };
    }, []);

    return (
        <>
            {children}
            <div className={cx('popup-area')}>
                {listNotify.map((e) => {
                    return <NotifyElement key={e.id} data={e} />;
                })}
            </div>
        </>
    );
}

export default NotifyPopup;
