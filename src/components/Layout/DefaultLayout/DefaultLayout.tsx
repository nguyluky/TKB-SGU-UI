import classNames from 'classnames/bind';

import { Dispatch, ReactElement, SetStateAction, createContext, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { defaultLayoutChildren } from '../../../routes';
import NotifyPopup from '../../NotifyPopup';
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
