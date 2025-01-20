import classNames from 'classnames/bind';
import { createContext, Dispatch, ReactElement, SetStateAction, useState } from 'react';
import { useOutlet } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';
import 'simplebar-react/dist/simplebar.min.css';
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
    const currentOutlet = useOutlet();

    const element = <AnimatePresence initial={false}>{currentOutlet}</AnimatePresence>;

    return (
        <headerContent.Provider value={setHeaderPar}>
            <NotifyPopup>
                <Header {...headerPar} />
                <div className={cx('content')} id="default-content">
                    {element}
                </div>
            </NotifyPopup>
        </headerContent.Provider>
    );
}

export { headerContent };
export default DefaultLayout;
