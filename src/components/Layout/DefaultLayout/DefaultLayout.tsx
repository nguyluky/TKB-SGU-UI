import classNames from 'classnames/bind';

import { createContext, Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { defaultLayoutChildren } from '../../../routes';
import NotifyPopup from '../../NotifyPopup';
import notifyMaster from '../../NotifyPopup/NotificationManager';
import Header from '../components/Header';
import style from './DefaultLayout.module.scss';

const cx = classNames.bind(style);

interface HeaderPar {
    left?: ReactElement;
    center?: ReactElement;
    right?: ReactElement;
}

const headerContent = createContext<Dispatch<SetStateAction<HeaderPar>>>(null!);

function DefaultLayout() {
    const [headerPar, setHeaderPar] = useState<HeaderPar>({});
    const location = useLocation();
    const currentOutlet = useOutlet();

    const { nodeRef } = defaultLayoutChildren.find((e) => e.path === location.pathname) || {};

    useEffect(() => {
        notifyMaster.warning(
            'cập nhật lại tkb k24, xin lỗi k24 về sợ bất tiện này ad ngủ quên, quên mất là mình có cái server. nên quên mất cập nhật. Nếu có bất cứ lỗi, hay sai sót nào thì vui lòng liện hệ',
            'xin lỗi',
            -1,
            function message() {
                window.open('https://m.me/61558476525330');
            },
        );
    }, []);

    return (
        <headerContent.Provider value={setHeaderPar}>
            <NotifyPopup>
                <Header {...headerPar} />
                <div className={cx('content')} id="default-content">
                    <SwitchTransition>
                        <CSSTransition
                            key={location.pathname}
                            nodeRef={nodeRef}
                            timeout={100}
                            unmountOnExit
                        >
                            {(state) => (
                                <div ref={nodeRef} className={cx('wrapper-page', state)}>
                                    {currentOutlet}
                                </div>
                            )}
                        </CSSTransition>
                    </SwitchTransition>
                </div>
            </NotifyPopup>
        </headerContent.Provider>
    );
}

export { headerContent };
export default DefaultLayout;
