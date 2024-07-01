import classNames from 'classnames/bind';
import { ReactElement } from 'react';

import style from './PopupModel.module.scss';

const cx = classNames.bind(style);

function Popup({ children, onOk, onCancel, title }: { children: ReactElement | ReactElement[]; onOk?: Function; onCancel?: Function; title: string }) {
    return (
        <div className={cx('conten-menu-popup')}>
            <div className={cx('header')}>
                <h2>{title}</h2>
            </div>
            <div className={cx('content')}>{children}</div>
            <div className={cx('buttons')}>
                {onCancel ? (
                    <button className={cx('cancel')} onClick={() => onCancel()}>
                        Huỷ
                    </button>
                ) : null}
                {onOk ? (
                    <button className={cx('ok')} onClick={() => onOk()}>
                        ok
                    </button>
                ) : null}
            </div>
        </div>
    );
}

export default Popup;
