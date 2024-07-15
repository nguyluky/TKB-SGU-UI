import classNames from 'classnames/bind';
import { ReactElement } from 'react';

import { LoadingSpinner } from '../../../components/Loading/Loading';
import style from './Loader.module.scss';

const cx = classNames.bind(style);

function Loader({
    isLoading,
    children,
    loadingType,
}: {
    isLoading: boolean;
    children: ReactElement;
    loadingType?: string;
}) {
    return isLoading ? (
        <div className={cx('wrapper')}>
            <LoadingSpinner />
        </div>
    ) : (
        children
    );
}

export default Loader;
