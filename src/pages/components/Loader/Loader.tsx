import classNames from 'classnames/bind';
import { ReactElement } from 'react';

import { LoadingSpinner } from '../../../components/Loading/Loading';
import style from './Loader.module.scss';

const cx = classNames.bind(style);

function Loader({ isLoading, children, error }: { isLoading: boolean; children: ReactElement; error?: Error }) {
    if (error) {
        return (
            <div className={cx('wrapper-error')}>
                <h4>(╯ ° □ °) ╯ ┻━━┻</h4>
                <div>Lỗi không xác định (message: {error.message})</div>
                <a href="#">Báo cáo lỗi</a>
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className={cx('wrapper')}>
                <LoadingSpinner />
            </div>
        );
    }
    return children;
}

export default Loader;
