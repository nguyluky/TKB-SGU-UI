import classNames from 'classnames/bind';

import Header from '../components/Header';
import style from './DefaultLayout.module.scss';
import { Outlet } from 'react-router-dom';
import { Dispatch, ReactElement, SetStateAction, createContext, useState } from 'react';
import NotifyPopup from '../../NotifyPopup';

const cx = classNames.bind(style);

interface HeaderPar {
    left?: ReactElement;
    center?: ReactElement;
    right?: ReactElement;
}

const headerContent = createContext<Dispatch<SetStateAction<HeaderPar>>>(null!);

function DefaultLayout() {
    const [headerPar, setHeaderPar] = useState<HeaderPar>({});
    return (
        <headerContent.Provider value={setHeaderPar}>
            <NotifyPopup>
                <Header {...headerPar} />
                <div className={cx('content')}>
                    <Outlet />
                </div>
            </NotifyPopup>
        </headerContent.Provider>
    );
}

export { headerContent };
export default DefaultLayout;
