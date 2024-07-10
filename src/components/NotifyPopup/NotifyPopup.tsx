import classNames from 'classnames/bind';
import { ReactElement, useEffect, useState } from 'react';
import NotifyElement from './NotifyElement';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
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
                <TransitionGroup>
                    {listNotify.map((e) => {
                        return (
                            <CSSTransition
                                key={e.id}
                                nodeRef={e.nodeRef}
                                timeout={{
                                    appear: 0,
                                    enter: 0,
                                    exit: 100,
                                }}
                            >
                                {(state) => {
                                    console.log(state);
                                    return (
                                        <div
                                            className={cx('animation-wrapper', state)}
                                            ref={e.nodeRef}
                                        >
                                            <NotifyElement data={e} />
                                        </div>
                                    );
                                }}
                            </CSSTransition>
                        );
                    })}
                </TransitionGroup>
            </div>
        </>
    );
}

export default NotifyPopup;
